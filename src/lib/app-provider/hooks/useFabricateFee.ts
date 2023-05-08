import type { StdFee } from "@cosmjs/stargate";
import big from "big.js";
import { useCallback } from "react";

import type { Gas } from "lib/types";

import { useCelatoneApp } from "./useCelatoneApp";

export const useFabricateFee = () => {
  const { constants, chainGasPrice } = useCelatoneApp();

  return useCallback(
    (estimatedGas: number): StdFee => {
      const adjustedGas = Math.min(
        Number(big(estimatedGas).mul(constants.gasAdjustment).toFixed(0)),
        constants.maxGasLimit
      );

      return {
        amount: [
          {
            denom: chainGasPrice.denom,
            amount: big(adjustedGas).mul(chainGasPrice.gasPrice).toFixed(0),
          },
        ],
        gas: adjustedGas.toString() as Gas<string>,
      };
    },
    [
      chainGasPrice.denom,
      chainGasPrice.gasPrice,
      constants.gasAdjustment,
      constants.maxGasLimit,
    ]
  );
};
