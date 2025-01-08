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
  const { isOpen, onClose, onOpen } = useDisclosure();

  const displayedCount = isMobile ? 4 : 6;
  return (
    <Stack spacing={4} w="100%" order={{ base: "-1", md: "1" }}>
      <Flex align="center" gap={1}>
        <Heading as="h6" variant="h6" fontWeight={600}>
          Attributes
        </Heading>
        <Badge variant="primary">{attributes.length}</Badge>
      </Flex>

      <SimpleGrid
        minChildWidth="172px"
        gap={4}
        templateColumns={isMobile ? "1fr 1fr" : "1fr 1fr 1fr"}
      >
        {attributes.slice(0, displayedCount).map(({ traitType, value }) => (
          <GridItem
            key={traitType}
            p="8px 12px"
            background="gray.900"
            borderRadius="8px"
          >
            <Stack spacing="4px">
              <Text
                variant="body3"
                color="text.dark"
                fontWeight={700}
                textTransform="capitalize"
              >
                {traitType}
              </Text>
              <Text variant="body2" fontWeight={700} textTransform="capitalize">
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
        address={nftAddress}
        attributes={attributes}
        isOpen={isOpen}
        title="Attributes"
        onClose={onClose}
        tokenId={tokenId}
      />
    </Stack>
  );
};
