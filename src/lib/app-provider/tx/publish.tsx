import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import type { PublishSucceedCallback } from "lib/app-fns/tx/publish";
import { publishModuleTx } from "lib/app-fns/tx/publish";

export interface PublishModuleStreamParams {
  estimatedFee?: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: PublishSucceedCallback;
}

export const usePublishModuleTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      estimatedFee,
      messages,
      onTxFailed,
      onTxSucceed,
    }: PublishModuleStreamParams) => {
      if (!address) throw new Error("No address provided (usePublishModuleTx)");
      if (!estimatedFee) return null;
      return publishModuleTx({
        address,
        fee: estimatedFee,
        messages,
        onTxFailed,
        onTxSucceed: (txResult) => {
          trackTxSucceed();
          onTxSucceed?.(txResult);
        },
        signAndBroadcast,
      });
    },
    [address, signAndBroadcast]
  );
};
