import type { Metadata } from "@initia/tx-decoder";

import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { zBechAddr32, zHexAddr } from "lib/types";
import { useMemo } from "react";

import { BalanceChangeNftBase } from "./balance-changes-nft-base";

interface BalanceChangeWasmNftProps {
  change: number;
  contractAddress: string;
  metadata: Metadata & {
    type: "wasm";
  };
  tokenId: string;
}

export const BalanceChangeWasmNft = ({
  change,
  contractAddress,
  tokenId,
}: BalanceChangeWasmNftProps) => {
  const formatAddresses = useFormatAddresses();

  const collectionAddressHex = useMemo(
    () => zHexAddr.parse(formatAddresses(contractAddress).hex),
    [contractAddress, formatAddresses]
  );
  const collectionAddressBech = useMemo(
    () => zBechAddr32.parse(formatAddresses(contractAddress).address),
    [contractAddress, formatAddresses]
  );

  // WASM metadata is currently empty in tx-decoder, so hasMetadata is always false
  // When WasmMetadata is populated in the future, we can check it here
  return (
    <BalanceChangeNftBase
      change={change}
      collectionAddressBech={collectionAddressBech}
      collectionAddressHex={collectionAddressHex}
      hasMetadata={false}
      tokenId={tokenId}
    />
  );
};
