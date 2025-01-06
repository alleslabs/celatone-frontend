import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { deployScriptTx } from "lib/app-fns/tx/script";

export interface DeployScriptStreamParams {
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
}

export const useDeployScriptTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
    }: DeployScriptStreamParams) => {
      if (!address) throw new Error("No address provided (useDeployScriptTx)");

      if (!estimatedFee) return null;
      return deployScriptTx({
        address,
        fee: estimatedFee,
        messages,
        signAndBroadcast,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
      });
    },
    [address, signAndBroadcast]
  );
};
