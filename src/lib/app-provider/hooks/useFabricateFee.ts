import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCelatoneApp } from "../contexts/app";
import { big } from "lib/types";
import type { Gas } from "lib/types";

export const useFabricateFee = () => {
  const {
    chainConfig: {
      gas: { gasPrice, gasAdjustment, maxGasLimit },
    },
  } = useCelatoneApp();

  return useCallback(
    (estimatedGas: number): StdFee => {
      const adjustedGas = Math.min(
        Number(big(estimatedGas).mul(gasAdjustment).toFixed(0)),
        maxGasLimit
      );

      return {
        amount: [
          {
            denom: gasPrice.denom,
            amount: big(adjustedGas).mul(gasPrice.tokenPerGas).toFixed(0),
          },
        ],
        gas: adjustedGas.toString() as Gas<string>,
      };
    },
    [gasAdjustment, gasPrice.denom, gasPrice.tokenPerGas, maxGasLimit]
  );
};
