import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useGetSigningClient } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { migrateContractTx } from "lib/app-fns/tx/migrate";
import type { BechAddr32, Option } from "lib/types";

export interface MigrateStreamParams {
  contractAddress: BechAddr32;
  codeId: number;
  migrateMsg: object;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
}

export const useMigrateTx = () => {
  const { address } = useCurrentChain();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      contractAddress,
      codeId,
      migrateMsg,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
    }: MigrateStreamParams) => {
      const client = await getSigningClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return migrateContractTx({
        sender: address,
        contractAddress,
        codeId,
        migrateMsg,
        fee: estimatedFee,
        client,
        onTxSucceed: (txHash) => {
          trackTxSucceed();
          onTxSucceed?.(txHash);
        },
        onTxFailed,
      });
    },
    [address, getSigningClient]
  );
};
