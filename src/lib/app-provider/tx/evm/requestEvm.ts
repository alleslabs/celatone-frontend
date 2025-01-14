import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { trackTxSucceed } from "lib/amplitude";
import { requestEvmTx } from "lib/app-fns/tx/evm/requestEvm";
import { useSignAndBroadcastEvm } from "lib/app-provider/hooks";
import type { HexAddr } from "lib/types";

export interface RequestEvmStreamParams {
  to: HexAddr;
  data: string;
  estimatedFee?: StdFee;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const useRequestEvmTx = () => {
  const signAndBroadcastEvm = useSignAndBroadcastEvm();

  return useCallback(
    async ({
      to,
      data,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
    }: RequestEvmStreamParams) => {
      if (!estimatedFee) return null;

      return requestEvmTx({
        to,
        data,
        fee: estimatedFee,
        signAndBroadcastEvm,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
      });
    },
    [signAndBroadcastEvm]
  );
};
