import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useGetSigningClient } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { publishModuleTx } from "lib/app-fns/tx/publish";
import type { HumanAddr, Option } from "lib/types";

export interface PublishTxInternalResult {
  txHash: string;
  txFee: Option<string>;
}

export type PublishSucceedCallback = (
  txResult: PublishTxInternalResult
) => void;

export interface PublishModuleStreamParams {
  onTxSucceed?: PublishSucceedCallback;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
}

export const usePublishModuleTx = () => {
  const { address } = useCurrentChain();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
    }: PublishModuleStreamParams) => {
      const client = await getSigningClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return publishModuleTx({
        address: address as HumanAddr,
        client,
        onTxSucceed: (txResult) => {
          trackTxSucceed();
          onTxSucceed?.(txResult);
        },
        onTxFailed,
        fee: estimatedFee,
        messages,
      });
    },
    [address, getSigningClient]
  );
};
