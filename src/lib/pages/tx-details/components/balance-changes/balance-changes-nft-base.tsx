import type { BechAddr32, HexAddr } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { AppLink } from "lib/components/AppLink";
import { NftImage } from "lib/components/nft/NftImage";
import {
  useNftByTokenId,
  useNftGlyphImage,
  useNftMetadata,
} from "lib/services/nft";

interface BalanceChangeNftBaseProps {
  change: number;
  collectionAddressBech: BechAddr32;
  collectionAddressHex: HexAddr;
  hasMetadata?: boolean;
  tokenId: string;
}

export const BalanceChangeNftBase = ({
  change,
  collectionAddressBech,
  collectionAddressHex,
  hasMetadata = false,
  tokenId,
}: BalanceChangeNftBaseProps) => {
  // Fetch NFT data using the contract address and token ID
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
      {hasMetadata ? (
        <AppLink
          href={`/nft-collections/${collectionAddressBech}/nft/${tokenId}`}
        >
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
