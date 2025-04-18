import type { SimulatedFeeEvm } from "lib/services/types";
import type { HexAddr20 } from "lib/types";

import { trackTxSucceed } from "lib/amplitude";
import { requestEvmTx } from "lib/app-fns/tx/evm/requestEvm";
import { useSignAndBroadcastEvm } from "lib/app-provider/hooks";
import { useCallback } from "react";

export interface RequestEvmStreamParams {
  to: HexAddr20;
  data: string;
  value: string;
  estimatedFee?: SimulatedFeeEvm;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
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
