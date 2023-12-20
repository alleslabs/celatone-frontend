import { Box, Image, Stack, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { useMetadata } from "lib/services/nftService";

interface Props {
  uri: string;
  tokenId: string;
  collectionAddress: string;
  nftAddress?: string;
}

const NFTCard = ({ uri, tokenId, nftAddress, collectionAddress }: Props) => {
  const { data: metadata } = useMetadata(uri);
  const navigate = useInternalNavigate();

  return (
    <Stack
      gap="8px"
      maxWidth="206px"
      w="100%"
      cursor="pointer"
      onClick={() =>
        navigate({
          pathname: "/nft/[collectionAddress]/[nftAddress]",
          query: { collectionAddress, nftAddress },
        })
      }
    >
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
