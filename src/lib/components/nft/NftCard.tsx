import { Box, Flex, Image, Text } from "@chakra-ui/react";

import { AppLink } from "../AppLink";
import { AmpEvent, track } from "lib/amplitude";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useMetadata } from "lib/services/nft";
import type { HexAddr32, Nullable, Option } from "lib/types";

interface NftCardProps {
  uri: string;
  tokenId: string;
  collectionName: Option<string>;
  collectionAddress: HexAddr32;
  nftAddress: Nullable<HexAddr32>;
  showCollection?: boolean;
}

export const NftCard = ({
  uri,
  tokenId,
  nftAddress,
  collectionName,
  collectionAddress,
  showCollection = false,
}: NftCardProps) => {
  const { data: metadata } = useMetadata(uri);

  return (
    <Flex direction="column" minW="full">
      <AppLink
        href={`/nft-collections/${collectionAddress}/nft/${nftAddress}`}
        onClick={() => track(AmpEvent.USE_NFT_CARD, { showCollection })}
      >
        <Box position="relative" width="100%" paddingBottom="100%" mb={2}>
          <Image
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            objectFit="contain"
            background="gray.900"
            backgroundPosition="center"
            borderRadius="8px"
            src={metadata?.image}
            fallbackSrc={NFT_IMAGE_PLACEHOLDER}
            fallbackStrategy="beforeLoadOrError"
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
      </AppLink>
    </Flex>
  );
};
