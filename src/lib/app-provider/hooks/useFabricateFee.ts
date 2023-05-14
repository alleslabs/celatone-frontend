import type { StdFee } from "@cosmjs/stargate";
import big from "big.js";
import { useCallback } from "react";

import { useCelatoneApp } from "../contexts/app";
import type { Gas } from "lib/types";

export const useFabricateFee = () => {
  const {
    chainConfig: {
      gas: { gasPrice, gasAdjustment },
    },
  } = useCelatoneApp();

  return useCallback(
    (estimatedGas: number): StdFee => {
      const adjustedGas = big(estimatedGas).mul(gasAdjustment).toFixed(0);

      return {
        amount: [
          {
            denom: gasPrice.denom,
            amount: big(adjustedGas).mul(gasPrice.tokenPerGas).toFixed(0),
          },
        ],
        gas: adjustedGas as Gas<string>,
      };
    },
    [gasAdjustment, gasPrice]
  );
};
