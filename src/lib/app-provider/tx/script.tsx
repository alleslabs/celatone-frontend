import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { deployScriptTx } from "lib/app-fns/tx/script";

export interface DeployScriptStreamParams {
  estimatedFee?: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
}

export const useDeployScriptTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      estimatedFee,
      messages,
      onTxFailed,
      onTxSucceed,
    }: DeployScriptStreamParams) => {
      if (!address) throw new Error("No address provided (useDeployScriptTx)");

      if (!estimatedFee) return null;
      return deployScriptTx({
        address,
        fee: estimatedFee,
        messages,
        onTxFailed,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        signAndBroadcast,
      });
    },
    [address, signAndBroadcast]
  );
};
