import type { Metadata } from "@initia/tx-decoder";

import { zBechAddr32, zHexAddr } from "lib/types";

import { BalanceChangeNftBase } from "./balance-changes-nft-base";

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

  const collectionAddressHex = zHexAddr.parse(contractAddress);
  const collectionAddressBech = zBechAddr32.parse(contractAddress);

  return (
    <BalanceChangeNftBase
      change={change}
      collectionAddressBech={collectionAddressBech}
      collectionAddressHex={collectionAddressHex}
      hasMetadata={!!nftMetadata?.contractAddress}
      tokenId={tokenId}
    />
  );
};
