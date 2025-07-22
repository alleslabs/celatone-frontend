import type { BechAddr32, HexAddr32 } from "lib/types";

import { useTierConfig } from "lib/app-provider";
import { useMetadata, useNfts, useNftsSequencer } from "lib/services/nft";

export const useGetFirstNftAsCollectionImage = (
  collectionAddressBech: BechAddr32,
  collectionAddressHex: HexAddr32
) => {
  const { isFullTier } = useTierConfig();

  // Note: Use limit 6 for the sake of performance when user gets into the details page
  const { data: nftsFull } = useNfts(
    collectionAddressBech,
    collectionAddressHex,
    6,
    0
  );

  const { data: nftsSequencer } = useNftsSequencer(collectionAddressBech, 6);

  const nfts = isFullTier ? nftsFull?.items : nftsSequencer;

  const { data: metadata } = useMetadata(nfts?.[0]);
  return metadata?.image;
};
