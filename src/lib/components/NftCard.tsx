import { Box, Image, Stack, Text } from "@chakra-ui/react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data/image";
import { useMetadata } from "lib/services/nftService";
import type { HexAddr } from "lib/types";

interface Props {
  uri: string;
  tokenId: string;
  collectionName: string;
  collectionAddress: HexAddr;
  nftAddress?: HexAddr;
}

export const NftCard = ({
  uri,
  tokenId,
  nftAddress,
  collectionName,
  collectionAddress,
}: Props) => {
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
          pathname: "/nft-collections/[collectionAddress]/nft/[nftAddress]",
          query: { collectionAddress, nftAddress },
        })
      }
    >
      {metadata?.image ? (
        <Image minW={size} h={size} borderRadius="8px" src={metadata.image} />
      ) : (
        <Image
          minW={size}
          h={size}
          borderRadius="8px"
          src={NFT_IMAGE_PLACEHOLDER}
        />
      )}
      <Box>
        <Text fontSize="14px" color="primary.main" fontWeight={600}>
          {collectionName}
        </Text>
        <Text fontSize="18px" fontWeight={600}>
          {tokenId}
        </Text>
        {metadata?.name && (
          <Text variant="body3" color="text.dark">
            Name: {metadata.name}
          </Text>
        )}
      </Box>
    </Stack>
  );
};
