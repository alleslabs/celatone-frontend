import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain } from "../hooks";
import { useTrack } from "lib/amplitude";
import { deployScriptTx } from "lib/app-fns/tx/script";
import type { HumanAddr } from "lib/types";

import { useCatchTxError } from "./catchTxError";

export interface DeployScriptStreamParams {
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
}

export const useDeployScriptTx = () => {
  const { address, getSigningCosmWasmClient } = useCurrentChain();
  const { trackTxSucceed } = useTrack();
  const catchTxError = useCatchTxError();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
    }: DeployScriptStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return deployScriptTx({
        address: address as HumanAddr,
        client,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
        catchTxError,
        fee: estimatedFee,
        messages,
      });
    },
    [address, getSigningCosmWasmClient, trackTxSucceed, catchTxError]
  );
};
