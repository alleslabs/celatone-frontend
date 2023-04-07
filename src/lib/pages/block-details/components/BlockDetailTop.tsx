import {
  chakra,
  Flex,
  Heading,
  IconButton,
  Text,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    padding: "0",
  },
});

export const BlockDetailTop = () => {
  const router = useRouter();
  const currentBlock = router.query.blockHeight;
  if (!currentBlock) return <Loading />;
  const block = Number(currentBlock);
  const prevBlock = block - 1;
  const nextBlock = block + 1;

  return (
    <Flex
      justify="space-between"
      mb={12}
      pb={12}
      mt={6}
      borderBottomColor="pebble.700"
      borderBottomWidth="1px"
    >
      <Flex direction="column" gap="1">
        <Flex alignItems="center">
          <CustomIcon name="block" boxSize="5" color="lilac.main" />
          <Heading as="h5" variant="h5" className="ellipsis">
            {currentBlock}
          </Heading>
        </Flex>
        <Flex gap="2">
          <Text variant="body2" color="text.dark">
            Block Hash:
          </Text>
          <Text variant="body2" color="lilac.main">
            6CFE94A1DA6F8902FA9E6D11F293229E241740C3EA4EF52B553BE65EA094B2B2
          </Text>
        </Flex>
        <Flex gap="2" alignItems="center">
          <Flex gap="1" alignItems="center">
            <CustomIcon name="history" boxSize="3" color="pebble.600" />
            <Text variant="body2" color="text.dark">
              2 hours ago
            </Text>
          </Flex>
          <Flex w="1" h="1" borderRadius="full" backgroundColor="pebble.600" />
          <Text variant="body2" color="text.dark">
            Oct 24, 2022, 7:58:34 PM (UTC)
          </Text>
        </Flex>
      </Flex>
      <Flex gap="2">
        <AppLink href={`/block/${prevBlock}`}>
          <StyledIconButton
            icon={<CustomIcon name="chevron-left" />}
            variant="ghost-gray"
          />
        </AppLink>
        <AppLink href={`/block/${nextBlock}`}>
          <StyledIconButton
            icon={<CustomIcon name="chevron-right" />}
            variant="ghost-gray"
          />
        </AppLink>
        <Button
          variant="ghost-gray"
          padding={2}
          rightIcon={<CustomIcon name="launch" boxSize="3" color="text.dark" />}
        >
          View in JSON
        </Button>
      </Flex>
    </Flex>
  );
};
