import { Box, Image, Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data/image";
import { useMetadata } from "lib/services/nftService";
import type { HexAddr } from "lib/types";

interface Props {
  uri: string;
  tokenId: string;
  showCollection?: boolean;
  collectionName: string;
  collectionAddress: HexAddr;
  nftAddress?: HexAddr;
}

export const NftCard = ({
  uri,
  tokenId,
  nftAddress,
  showCollection = false,
  collectionName,
  collectionAddress,
}: Props) => {
  const { data: metadata } = useMetadata(uri);
  const navigate = useInternalNavigate();

  return (
    <Flex
      direction="column"
      gap={2}
      minW="full"
      cursor="pointer"
      onClick={() =>
        navigate({
          pathname: "/nft-collections/[collectionAddress]/nft/[nftAddress]",
          query: { collectionAddress, nftAddress },
        })
      }
    >
      <Box position="relative" width="100%" paddingBottom="100%">
        <Image
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          objectFit="cover"
          borderRadius="8px"
          src={metadata?.image ? metadata.image : NFT_IMAGE_PLACEHOLDER}
        />
      </Box>
      <Box>
        {showCollection && (
          <Text fontSize="14px" color="primary.main" fontWeight={600}>
            {collectionName}
          </Text>
        )}
        <Text fontSize="18px" fontWeight={600}>
          {tokenId}
        </Text>
        {metadata?.name && (
          <Text variant="body3" color="text.dark">
            Name: {metadata.name}
          </Text>
        )}
      </Box>
    </Flex>
  );
};
