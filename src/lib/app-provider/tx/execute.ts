import type { Coin, StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain } from "../hooks";
import { useTrack } from "lib/amplitude";
import { executeContractTx } from "lib/app-fns/tx/execute";
import type { Activity } from "lib/stores/contract";
import type { ContractAddr, HumanAddr } from "lib/types";

import { useCatchTxError } from "./catchTxError";

export interface ExecuteStreamParams {
  onTxSucceed?: (activity: Activity) => void;
  onTxFailed?: () => void;
  estimatedFee: StdFee | undefined;
  contractAddress: ContractAddr;
  msg: object;
  funds: Coin[];
}

export const useExecuteContractTx = () => {
  const { address, getSigningCosmWasmClient } = useCurrentChain();
  const { trackTxSucceed } = useTrack();
  const catchTxError = useCatchTxError();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      contractAddress,
      msg,
      funds,
    }: ExecuteStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return executeContractTx({
        address: address as HumanAddr,
        contractAddress,
        fee: estimatedFee,
        msg,
        funds,
        client,
        catchTxError,
        onTxSucceed: (activity) => {
          trackTxSucceed();
          onTxSucceed?.(activity);
        },
        onTxFailed,
      });
    },
    [address, getSigningCosmWasmClient, trackTxSucceed, catchTxError]
  );
};
