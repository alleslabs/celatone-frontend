import type { Nft } from "lib/services/types";

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useEvmConfig, useMoveConfig } from "lib/app-provider";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useMetadata } from "lib/services/nft";

import { AppLink } from "../AppLink";

interface NftCardProps {
  nft: Nft;
  showCollection?: boolean;
}

export const NftCard = ({ nft, showCollection = false }: NftCardProps) => {
  const { data: metadata } = useMetadata(nft);
  const {
    collectionAddress: collectionAddressParam,
    collectionName,
    nftAddress,
    tokenId,
  } = nft;

  const { enabled: isEvmEnabled } = useEvmConfig({ shouldRedirect: false });
  const { enabled: isMoveEnabled } = useMoveConfig({ shouldRedirect: false });
  const formatAddresses = useFormatAddresses();

  const formattedCollectionAddress = formatAddresses(collectionAddressParam);
  const collectionAddress = isEvmEnabled
    ? formattedCollectionAddress.hex
    : formattedCollectionAddress.address;

  return (
    <Flex direction="column" minW="full">
      <AppLink
        href={`/nft-collections/${collectionAddress}/nft/${isMoveEnabled ? nftAddress : tokenId}`}
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
