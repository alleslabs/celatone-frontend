import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain } from "../hooks";
import { useTrack } from "lib/amplitude";
import { migrateContractTx } from "lib/app-fns/tx/migrate";
import type { ContractAddr, HumanAddr, Option } from "lib/types";

import { useCatchTxError } from "./catchTxError";

export interface MigrateStreamParams {
  contractAddress: ContractAddr;
  codeId: number;
  migrateMsg: object;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
}

export const useMigrateTx = () => {
  const { address, getSigningCosmWasmClient } = useCurrentChain();
  const { trackTxSucceed } = useTrack();
  const catchTxError = useCatchTxError();

  return useCallback(
    async ({
      contractAddress,
      codeId,
      migrateMsg,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
    }: MigrateStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return migrateContractTx({
        sender: address as HumanAddr,
        contractAddress,
        codeId,
        migrateMsg,
        fee: estimatedFee,
        client,
        catchTxError,
        onTxSucceed: (txHash) => {
          trackTxSucceed();
          onTxSucceed?.(txHash);
        },
        onTxFailed,
      });
    },
    [address, getSigningCosmWasmClient, trackTxSucceed, catchTxError]
  );
};
