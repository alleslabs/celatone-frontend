import type { BechAddr32, HexAddr32 } from "lib/types";

import { useMetadata, useNfts } from "lib/services/nft";

export const useGetFirstNftAsCollectionImage = (
  collectionAddressBech: BechAddr32,
  collectionAddressHex: HexAddr32
) => {
  // Note: Use limit 10 and offset 0 for the sake of performance when user gets into the details page
  const { data: nfts } = useNfts(
    collectionAddressBech,
    collectionAddressHex,
    10,
    0
  );

  const { data: metadata } = useMetadata(nfts?.items?.[0]?.uri ?? "");
  return metadata?.image;
};
