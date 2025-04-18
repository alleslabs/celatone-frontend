import type { BlockData } from "lib/types";

import {
  Button,
  chakra,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { trackUseViewJSON } from "lib/amplitude";
import { AppLink } from "lib/components/AppLink";
import { CopyLink } from "lib/components/CopyLink";
import { DotSeparator } from "lib/components/DotSeparator";
import { CustomIcon } from "lib/components/icon";
import { useOpenBlockTab } from "lib/hooks/useOpenTab";
import { dateFromNow, formatUTC } from "lib/utils";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    display: "flex",
    padding: 0,
  },
});

interface BlockDetailsTopProps {
  blockData: BlockData;
}

export const BlockDetailsTop = ({ blockData }: BlockDetailsTopProps) => {
  const block = Number(blockData.height);
  const openBlockTab = useOpenBlockTab();

  const openRestPage = () => {
    trackUseViewJSON("Block Details");
    openBlockTab(blockData.height);
  };

  const disablePrevious = block <= 1;
  return (
    <Flex
      borderBottomColor="gray.700"
      borderBottomWidth="1px"
      justify="space-between"
      mb={8}
      pb={8}
    >
      <Flex direction="column" gap={1} w="full">
        <Flex
          align="center"
          justify="space-between"
          mb={{ base: 2, md: 0 }}
          mt={{ base: 2, md: 5 }}
          width="full"
        >
          <Flex align="center">
            <CustomIcon boxSize={5} color="primary.main" name="block" />
            <Heading
              className="ellipsis"
              as="h5"
              variant={{ base: "h6", md: "h5" }}
            >
              {blockData.height}
            </Heading>
          </Flex>
          <Flex align="center" gap={{ base: 1, md: 2 }}>
            {!disablePrevious && (
              <AppLink href={`/blocks/${block - 1}`}>
                <StyledIconButton
                  aria-label="button"
                  icon={<CustomIcon name="chevron-left" />}
                  variant="ghost-gray"
                />
              </AppLink>
            )}
            <AppLink href={`/blocks/${block + 1}`}>
              <StyledIconButton
                aria-label="button"
                icon={<CustomIcon name="chevron-right" />}
                variant="ghost-gray"
              />
            </AppLink>
            <Button
              rightIcon={<CustomIcon boxSize={3} name="launch" />}
              size={{ base: "sm", md: "md" }}
              variant="ghost-gray"
              onClick={openRestPage}
            >
              View in JSON
            </Button>
          </Flex>
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 0, md: 2 }}
        >
          <Text
            color="text.dark"
            display="inline"
            fontWeight={500}
            variant="body2"
          >
            Block hash:
          </Text>
          <CopyLink
            amptrackSection="block_details_top"
            type="block_hash"
            value={blockData.hash.toUpperCase()}
          />
        </Flex>
        <Flex alignItems="center" gap={2} mt={1}>
          <Flex alignItems="center" gap={1}>
            <CustomIcon boxSize={3} color="gray.600" name="history" />
            <Text color="text.dark" variant={{ base: "body3", md: "body2" }}>
              {dateFromNow(blockData.timestamp)}
            </Text>
          </Flex>
          <DotSeparator />
          <Text color="text.dark" variant={{ base: "body3", md: "body2" }}>
            {formatUTC(blockData.timestamp)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
