import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { big } from "lib/types";
import type { Gas } from "lib/types";

import { useGas } from "./useGas";

export const useFabricateFee = () => {
  const { tokenPerGas, denom, gasAdjustment, maxGasLimit } = useGas();

  return useCallback(
    (estimatedGas: number): StdFee => {
      const adjustedGas = Math.min(
        Number(big(estimatedGas).mul(gasAdjustment).toFixed(0)),
        maxGasLimit
      );

      return {
        amount: [
          {
            denom,
            amount: big(adjustedGas).mul(tokenPerGas).toFixed(0),
          },
        ],
        gas: adjustedGas.toString() as Gas<string>,
      };
    },
    [gasAdjustment, denom, tokenPerGas, maxGasLimit]
  );
};
