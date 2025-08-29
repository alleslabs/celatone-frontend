import type { HexAddr32 } from "lib/types";

import { useTierConfig } from "lib/app-provider";
import { useNftMetadata, useNfts, useNftsSequencer } from "lib/services/nft";

export const useGetFirstNftAsCollectionImage = (
  collectionAddressHex: HexAddr32
) => {
  const { isFullTier } = useTierConfig();

  // Note: Use limit 6 for the sake of performance when user gets into the details page
  const { data: nftsFull } = useNfts(collectionAddressHex, 6, 0);

  const { data: nftsSequencer } = useNftsSequencer(collectionAddressHex, 6);

  const nfts = isFullTier ? nftsFull?.items : nftsSequencer;

  const { data: metadata } = useNftMetadata(nfts?.[0]);
  return metadata?.image;
};
