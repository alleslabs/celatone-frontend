import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import type { PublishSucceedCallback } from "lib/app-fns/tx/publish";

import { trackTxSucceed } from "lib/amplitude";
import { publishModuleTx } from "lib/app-fns/tx/publish";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";

export interface PublishModuleStreamParams {
  onTxSucceed?: PublishSucceedCallback;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
}

export const usePublishModuleTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
    }: PublishModuleStreamParams) => {
      if (!address) throw new Error("No address provided (usePublishModuleTx)");
      if (!estimatedFee) return null;
      return publishModuleTx({
        address,
        signAndBroadcast,
        onTxSucceed: (txResult) => {
          trackTxSucceed();
          onTxSucceed?.(txResult);
        },
        onTxFailed,
        fee: estimatedFee,
        messages,
      });
    },
    [address, signAndBroadcast]
  );
};
