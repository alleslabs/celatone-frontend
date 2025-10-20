import type { Metadata } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { AppLink } from "lib/components/AppLink";
import { NftImage } from "lib/components/nft/NftImage";
import {
  useNftByTokenId,
  useNftGlyphImage,
  useNftMetadata,
} from "lib/services/nft";
import { zBechAddr32, zHexAddr } from "lib/types";

interface BalanceChangeEvmNftProps {
  change: number;
  contractAddress: string;
  metadata: Metadata & {
    type: "evm";
  };
  tokenId: string;
}

export const BalanceChangeEvmNft = ({
  change,
  contractAddress,
  metadata,
  tokenId,
}: BalanceChangeEvmNftProps) => {
  const nftMetadata = metadata.data[contractAddress]?.[tokenId];

  // Fetch NFT data using the contract address and token ID
  const collectionAddressHex = zHexAddr.parse(contractAddress);
  const collectionAddressBech = zBechAddr32.parse(contractAddress);
  const { data: nft } = useNftByTokenId(
    collectionAddressHex,
    collectionAddressBech,
    tokenId
  );

  // Fetch NFT metadata for name and image
  const { data: nftData } = useNftMetadata(nft);
  const nftImage = useNftGlyphImage(nft);

  if (!nft) return null;

  const isPositiveAmount = change > 0;
  const formattedAmount = `${isPositiveAmount ? "+" : "-"}${" "}${nftData?.name || `#${tokenId}`}`;

  return (
    <Flex align="center" gap={1}>
      {nftMetadata?.contractAddress ? (
        <AppLink href={`/nft-collections/${contractAddress}/nft/${tokenId}`}>
          <NftImage
            borderRadius="4px"
            height="20px"
            src={nftImage}
            width="20px"
          />
        </AppLink>
      ) : (
        <NftImage
          borderRadius="4px"
          height="20px"
          src={nftImage}
          width="20px"
        />
      )}
      <Text color={isPositiveAmount ? "success.main" : "error.main"}>
        {formattedAmount}
      </Text>
    </Flex>
  );
};
