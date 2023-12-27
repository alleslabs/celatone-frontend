import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useGetSigningClient } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { deployScriptTx } from "lib/app-fns/tx/script";
import type { HumanAddr } from "lib/types";

export interface DeployScriptStreamParams {
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
}

export const useDeployScriptTx = () => {
  const { address } = useCurrentChain();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
    }: DeployScriptStreamParams) => {
      const client = await getSigningClient();
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
        fee: estimatedFee,
        messages,
      });
    },
    [address, getSigningClient]
  );
};
