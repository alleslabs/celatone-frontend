import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { resendTx } from "lib/app-fns/tx/resend";
import type { HumanAddr } from "lib/types";

export interface ResendStreamParams {
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
}

export const useResendTx = () => {
  const { address, getCosmWasmClient } = useWallet();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
    }: ResendStreamParams) => {
      const client = await getCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return resendTx({
        address: address as HumanAddr,
        client,
        onTxSucceed,
        onTxFailed,
        fee: estimatedFee,
        messages,
      });
    },
    [address, getCosmWasmClient]
  );
};
