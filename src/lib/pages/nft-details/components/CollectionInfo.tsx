import { Box, Stack, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import type { HexAddr } from "lib/types";

const CollectionInfo = ({
  collectionAddress,
  collectionName,
  description,
}: {
  collectionAddress: HexAddr;
  collectionName: string;
  description: string;
}) => {
  return (
    <Stack spacing="8px">
      <Text fontSize="14px" fontWeight={700}>
        About {collectionName} Collection
      </Text>
      <Box>
        <Text display="inline" color="gray.400">
          {description ?? "No description was provided by the creator."}
        </Text>{" "}
        <AppLink href={`/nft-collections/${collectionAddress}`}>
          <Text
            display="inline"
            fontSize="14px"
            color="primary.main"
            borderColor="primary.main"
          >
            View Collection
          </Text>
        </AppLink>
      </Box>
    </Stack>
  );
};

export default CollectionInfo;
