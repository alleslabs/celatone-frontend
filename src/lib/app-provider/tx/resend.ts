import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain } from "../hooks";
import { useTrack } from "lib/amplitude";
import { resendTx } from "lib/app-fns/tx/resend";
import type { HumanAddr } from "lib/types";

import { useCatchTxError } from "./catchTxError";

export interface ResendStreamParams {
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
}

export const useResendTx = () => {
  const { address, getSigningCosmWasmClient } = useCurrentChain();
  const { trackTxSucceed } = useTrack();
  const catchTxError = useCatchTxError();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
    }: ResendStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return resendTx({
        address: address as HumanAddr,
        client,
        fee: estimatedFee,
        messages,
        catchTxError,
        onTxSucceed: (txHash) => {
          trackTxSucceed();
          onTxSucceed?.(txHash);
        },
        onTxFailed,
      });
    },
    [address, getSigningCosmWasmClient, trackTxSucceed, catchTxError]
  );
};
