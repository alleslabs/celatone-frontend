import { Box, Image, Stack, Text } from "@chakra-ui/react";

import { useMetadata } from "lib/services/nftService";
import type { NFTToken } from "lib/types";

const NFTCard = ({ uri, tokenId }: NFTToken) => {
  const { data: metadata } = useMetadata(uri);
  return (
    <Stack gap="8px" maxWidth="206px" w="100%">
      {metadata ? (
        <Image minW="206px" h="206px" borderRadius="8px" src={metadata.image} />
      ) : (
        <Box minW="206px" h="206px" borderRadius="8px" bg="gray.800" />
      )}
      <Text fontSize="18px" fontWeight={600}>
        {metadata?.name ?? tokenId}
      </Text>
    </Stack>
  );
};

export default NFTCard;
