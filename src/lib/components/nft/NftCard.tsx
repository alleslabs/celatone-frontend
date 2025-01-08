import { Box, Flex, Image, Text } from "@chakra-ui/react";

import { AppLink } from "../AppLink";
import { AmpEvent, track } from "lib/amplitude";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useMetadata } from "lib/services/nft";
import type { HexAddr32, Nullable, Option } from "lib/types";

interface NftCardProps {
  collectionAddress: HexAddr32;
  collectionName: Option<string>;
  nftAddress: Nullable<HexAddr32>;
  showCollection?: boolean;
  tokenId: string;
  uri: string;
}

export const NftCard = ({
  collectionAddress,
  collectionName,
  nftAddress,
  showCollection = false,
  tokenId,
  uri,
}: NftCardProps) => {
  const { data: metadata } = useMetadata(uri);

  return (
    <Flex minW="full" direction="column">
      <AppLink
        onClick={() => track(AmpEvent.USE_NFT_CARD, { showCollection })}
        href={`/nft-collections/${collectionAddress}/nft/${nftAddress}`}
      >
        <Box width="100%" mb={2} paddingBottom="100%" position="relative">
          <Image
            width="100%"
            fallbackSrc={NFT_IMAGE_PLACEHOLDER}
            fallbackStrategy="beforeLoadOrError"
            height="100%"
            left={0}
            src={metadata?.image}
            background="gray.900"
            backgroundPosition="center"
            borderRadius="8px"
            objectFit="contain"
            position="absolute"
            top={0}
          />
        </Box>
        <Box>
          {showCollection && (
            <Text color="primary.main" fontSize="14px" fontWeight={600}>
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
