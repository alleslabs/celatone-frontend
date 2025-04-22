import type { SimulatedFeeEvm } from "lib/services/types";
import type { HexAddr20 } from "lib/types";

import { trackTxSucceed } from "lib/amplitude";
import { requestEvmTx } from "lib/app-fns/tx/evm/requestEvm";
import { useSignAndBroadcastEvm } from "lib/app-provider/hooks";
import { useCallback } from "react";

export interface RequestEvmStreamParams {
  data: string;
  estimatedFee?: SimulatedFeeEvm;
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
  to: HexAddr20;
  value: string;
}

export const useRequestEvmTx = () => {
  const signAndBroadcastEvm = useSignAndBroadcastEvm();

  return useCallback(
    async ({
      data,
      estimatedFee,
      onTxFailed,
      onTxSucceed,
      to,
      value,
    }: RequestEvmStreamParams) => {
      if (!estimatedFee) return null;

      return requestEvmTx({
        data,
        estimatedFee,
        onTxFailed,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        signAndBroadcastEvm,
        to,
        value,
      });
    },
    [signAndBroadcastEvm]
  );
};
