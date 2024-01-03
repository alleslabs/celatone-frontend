import type { Coin, StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useGetSigningClient } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { executeContractTx } from "lib/app-fns/tx/execute";
import type { Activity } from "lib/stores/contract";
import type { BechAddr32 } from "lib/types";

export interface ExecuteStreamParams {
  onTxSucceed?: (activity: Activity) => void;
  onTxFailed?: () => void;
  estimatedFee: StdFee | undefined;
  contractAddress: BechAddr32;
  msg: object;
  funds: Coin[];
}

export const useExecuteContractTx = () => {
  const { address } = useCurrentChain();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      contractAddress,
      msg,
      funds,
    }: ExecuteStreamParams) => {
      const client = await getSigningClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return executeContractTx({
        address,
        contractAddress,
        fee: estimatedFee,
        msg,
        funds,
        client,
        onTxSucceed: (activity) => {
          trackTxSucceed();
          onTxSucceed?.(activity);
        },
        onTxFailed,
      });
    },
    [address, getSigningClient]
  );
};
