import { Box, Stack, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";

const CollectionInfo = ({
  collectionAddress,
  collectionName,
  description,
}: {
  collectionAddress: string;
  collectionName: string;
  description: string;
}) => {
  return (
    <Stack spacing="8px">
      <Text fontSize="14px" fontWeight={700}>
        {collectionName}
      </Text>
      <Box>
        <Text display="inline" color="gray.400">
          {description}
        </Text>{" "}
        <AppLink href={`/collections/${collectionAddress}`}>
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
