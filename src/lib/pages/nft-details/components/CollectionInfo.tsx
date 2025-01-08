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
    <Text display="inline" mb={1} mt={2} variant="body2" color="gray.400">
      {description ?? "No description was provided by the creator."}
    </Text>
    <AppLink href={`/nft-collections/${collectionAddress}`}>
      <Text
        mt={1}
        variant="body2"
        _hover={{
          "& > p": { color: "primary.light" },
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        color="primary.main"
      >
        View Collection
      </Text>
    </AppLink>
  </Flex>
);
