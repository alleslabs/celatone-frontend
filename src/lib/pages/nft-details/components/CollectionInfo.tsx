import { Flex, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import type { HexAddr32 } from "lib/types";

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
    <Text variant="body2" fontWeight={700} wordBreak="break-word">
      About {collectionName} Collection
    </Text>
    <Text display="inline" color="gray.400" variant="body2" mt={2} mb={1}>
      {description ?? "No description was provided by the creator."}
    </Text>
    <AppLink href={`/nft-collections/${collectionAddress}`}>
      <Text
        variant="body2"
        color="primary.main"
        mt={1}
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
          "& > p": { color: "primary.light" },
        }}
      >
        View Collection
      </Text>
    </AppLink>
  </Flex>
);
