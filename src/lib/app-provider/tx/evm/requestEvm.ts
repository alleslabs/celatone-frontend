import { useCallback } from "react";

import { trackTxSucceed } from "lib/amplitude";
import { requestEvmTx } from "lib/app-fns/tx/evm/requestEvm";
import { useSignAndBroadcastEvm } from "lib/app-provider/hooks";
import { SimulatedFeeEvm } from "lib/services/types";
import type { HexAddr20 } from "lib/types";

export interface RequestEvmStreamParams {
  to: HexAddr20;
  data: string;
  estimatedFee?: SimulatedFeeEvm;
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
        estimatedFee,
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
