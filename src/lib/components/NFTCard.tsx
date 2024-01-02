import { Box, Image, Stack, Text } from "@chakra-ui/react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { useMetadata } from "lib/services/nftService";
import type { HexAddr } from "lib/types";

interface Props {
  uri: string;
  tokenId: string;
  collectionAddress?: HexAddr;
  nftAddress?: HexAddr;
}

const NFTCard = ({ uri, tokenId, nftAddress, collectionAddress }: Props) => {
  const { data: metadata } = useMetadata(uri);
  const navigate = useInternalNavigate();

  const isMobile = useMobile();
  const size = isMobile ? "150px" : "206px";
  return (
    <Stack
      gap="8px"
      maxWidth={size}
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
        <Image minW={size} h={size} borderRadius="8px" src={metadata.image} />
      ) : (
        <Box minW={size} h={size} borderRadius="8px" bg="gray.800" />
      )}
      <Text fontSize="18px" fontWeight={600}>
        {metadata?.name ?? tokenId}
      </Text>
    </Stack>
  );
};

export default NFTCard;
