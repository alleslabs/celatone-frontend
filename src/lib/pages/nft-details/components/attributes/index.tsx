import type { HexAddr32, Trait } from "lib/types";

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
    <Stack order={{ base: "-1", md: "1" }} spacing={4} w="100%">
      <Flex align="center" gap={1}>
        <Heading as="h6" fontWeight={600} variant="h6">
          Attributes
        </Heading>
        <Badge variant="primary">{attributes.length}</Badge>
      </Flex>

      <SimpleGrid
        gap={4}
        minChildWidth="172px"
        templateColumns={isMobile ? "1fr 1fr" : "1fr 1fr 1fr"}
      >
        {attributes.slice(0, displayedCount).map(({ traitType, value }) => (
          <GridItem
            key={traitType}
            background="gray.900"
            borderRadius="8px"
            p="8px 12px"
          >
            <Stack spacing="4px">
              <Text
                color="text.dark"
                fontWeight={700}
                textTransform="capitalize"
                variant="body3"
              >
                {traitType}
              </Text>
              <Text fontWeight={700} textTransform="capitalize" variant="body2">
                {value}
              </Text>
            </Stack>
          </GridItem>
        ))}
      </SimpleGrid>
      {attributes.length > displayedCount && (
        <Button
          _hover={{ background: "transparent" }}
          bg="transparent"
          onClick={onOpen}
        >
          <Flex align="center" gap="7px">
            <Text color="text.dark">View more</Text>
            <CustomIcon color="text.dark" name="chevron-down" />
          </Flex>
        </Button>
      )}
      <AttributesModal
        address={nftAddress}
        attributes={attributes}
        isOpen={isOpen}
        title="Attributes"
        tokenId={tokenId}
        onClose={onClose}
      />
    </Stack>
  );
};
