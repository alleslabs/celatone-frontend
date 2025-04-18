import type { HexAddr32 } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { AppLink } from "lib/components/AppLink";

interface CollectionInfoProps {
  collectionAddress: HexAddr32;
  collectionName: string;
  description: string;
}

export const CollectionInfo = ({
  collectionAddress,
  collectionName,
  description,
}: CollectionInfoProps) => (
  <Flex direction="column">
    <Text fontWeight={700} variant="body2" wordBreak="break-word">
      About {collectionName} Collection
    </Text>
    <Text color="gray.400" display="inline" mb={1} mt={2} variant="body2">
      {description ?? "No description was provided by the creator."}
    </Text>
    <AppLink href={`/nft-collections/${collectionAddress}`}>
      <Text
        _hover={{
          "& > p": { color: "primary.light" },
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        color="primary.main"
        mt={1}
        variant="body2"
      >
        View Collection
      </Text>
    </AppLink>
  </Flex>
);
