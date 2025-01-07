import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { resendTx } from "lib/app-fns/tx/resend";

export interface ResendStreamParams {
  estimatedFee?: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: (txHash: string) => void;
}

export const useResendTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      estimatedFee,
      messages,
      onTxFailed,
      onTxSucceed,
    }: ResendStreamParams) => {
      if (!address) throw new Error("No address provided (useResendTx)");
      if (!estimatedFee) return null;
      return resendTx({
        address,
        fee: estimatedFee,
        messages,
        onTxFailed,
        onTxSucceed: (txHash) => {
          trackTxSucceed();
          onTxSucceed?.(txHash);
        },
        signAndBroadcast,
      });
    },
    [address, signAndBroadcast]
  );
};
