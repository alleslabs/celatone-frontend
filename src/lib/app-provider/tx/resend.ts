import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";

import { trackTxSucceed } from "lib/amplitude";
import { resendTx } from "lib/app-fns/tx/resend";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";

export interface ResendStreamParams {
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
}

export const useResendTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
    }: ResendStreamParams) => {
      if (!address) throw new Error("No address provided (useResendTx)");
      if (!estimatedFee) return null;
      return resendTx({
        address,
        fee: estimatedFee,
        messages,
        signAndBroadcast,
        onTxSucceed: (txHash) => {
          trackTxSucceed();
          onTxSucceed?.(txHash);
        },
        onTxFailed,
      });
    },
    [address, signAndBroadcast]
  );
};
