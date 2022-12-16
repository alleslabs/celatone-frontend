import type { StdFee } from "@cosmjs/stargate";
import big from "big.js";
import { useCallback } from "react";

import type { Gas } from "lib/types";

import { useCelatoneApp } from "./useCelatoneApp";

export const useFabricateFee = () => {
  const { constants, chainGasPrice } = useCelatoneApp();

  return useCallback(
    (estimatedGas: number): StdFee => {
      const adjustedGas = big(estimatedGas)
        .mul(constants.gasAdjustment)
        .toFixed(0);

      return {
        amount: [
          {
            denom: chainGasPrice.denom,
            amount: big(adjustedGas).mul(chainGasPrice.gasPrice).toFixed(0),
          },
        ],
        gas: adjustedGas as Gas<string>,
      };
    },
    [chainGasPrice, constants.gasAdjustment]
  );
};
