import {
  Badge,
  Button,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { HexAddr32, Trait } from "lib/types";

import { AttributesModal } from "./AttributesModal";

interface AttributesProps {
  attributes: Trait[];
  nftAddress: HexAddr32;
  tokenId: string;
}

export const Attributes = ({
  attributes,
  nftAddress,
  tokenId,
}: AttributesProps) => {
  const isMobile = useMobile();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const displayedCount = isMobile ? 4 : 6;
  return (
    <Stack w="100%" spacing={4} order={{ base: "-1", md: "1" }}>
      <Flex align="center" gap={1}>
        <Heading as="h6" variant="h6" fontWeight={600}>
          Attributes
        </Heading>
        <Badge variant="primary">{attributes.length}</Badge>
      </Flex>

      <SimpleGrid
        templateColumns={isMobile ? "1fr 1fr" : "1fr 1fr 1fr"}
        minChildWidth="172px"
        gap={4}
      >
        {attributes.slice(0, displayedCount).map(({ traitType, value }) => (
          <GridItem
            p="8px 12px"
            background="gray.900"
            borderRadius="8px"
            key={traitType}
          >
            <Stack spacing="4px">
              <Text
                variant="body3"
                textTransform="capitalize"
                fontWeight={700}
                color="text.dark"
              >
                {traitType}
              </Text>
              <Text variant="body2" textTransform="capitalize" fontWeight={700}>
                {value}
              </Text>
            </Stack>
          </GridItem>
        ))}
      </SimpleGrid>
      {attributes.length > displayedCount && (
        <Button
          bg="transparent"
          _hover={{ background: "transparent" }}
          onClick={onOpen}
        >
          <Flex align="center" gap="7px">
            <Text color="text.dark">View More</Text>
            <CustomIcon name="chevron-down" color="text.dark" />
          </Flex>
        </Button>
      )}
      <AttributesModal
        title="Attributes"
        attributes={attributes}
        address={nftAddress}
        tokenId={tokenId}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Stack>
  );
};
