import type { StdFee } from "@cosmjs/stargate";
import type { Gas } from "lib/types";

import { big } from "lib/types";
import { useCallback } from "react";

import { useGas } from "./useGas";

export const useFabricateFee = () => {
  const { denom, gasAdjustment, maxGasLimit, tokenPerGas } = useGas();

  return useCallback(
    (estimatedGas: number): StdFee => {
      const adjustedGas = Math.min(
        Number(big(estimatedGas).mul(gasAdjustment).toFixed(0)),
        maxGasLimit
      );

      return {
        amount: [
          {
            amount: big(adjustedGas).mul(tokenPerGas).toFixed(0),
            denom,
          },
        ],
        gas: adjustedGas.toString() as Gas<string>,
      };
    },
    [gasAdjustment, denom, tokenPerGas, maxGasLimit]
  );
};
