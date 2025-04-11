import type { HexAddr32, Nullable, Option } from "lib/types";

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useMetadata } from "lib/services/nft";

import { AppLink } from "../AppLink";

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
        <Box mb={2} paddingBottom="100%" position="relative" width="100%">
          <Image
            background="gray.900"
            backgroundPosition="center"
            borderRadius="8px"
            fallbackSrc={NFT_IMAGE_PLACEHOLDER}
            fallbackStrategy="beforeLoadOrError"
            height="100%"
            left={0}
            objectFit="contain"
            position="absolute"
            src={metadata?.image}
            top={0}
            width="100%"
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
            <Text color="text.dark" variant="body3">
              Name: {metadata.name}
            </Text>
          )}
        </Box>
      </AppLink>
    </Flex>
  );
};
