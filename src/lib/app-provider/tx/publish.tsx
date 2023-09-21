import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain } from "../hooks";
import { publishModuleTx } from "lib/app-fns/tx/publish";
import type { HumanAddr } from "lib/types";

export interface PublishTxInternalResult {
  txHash: string;
  formattedFee: string;
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
  const { address, getSigningCosmWasmClient } = useCurrentChain();
  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
    }: PublishModuleStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return publishModuleTx({
        address: address as HumanAddr,
        client,
        onTxSucceed,
        onTxFailed,
        fee: estimatedFee,
        messages,
      });
    },
    [address, getSigningCosmWasmClient]
  );
};
