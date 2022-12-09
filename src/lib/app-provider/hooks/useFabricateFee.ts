import type { StdFee } from "@cosmjs/stargate";
import big from "big.js";
import { useCallback } from "react";

import { useApp } from "../contexts";
import type { Gas } from "lib/types";

export const useFabricateFee = () => {
  const { constants, chainGas } = useApp();

  return useCallback(
    (estimatedGas: number): StdFee => {
      const adjustedGas = big(estimatedGas)
        .mul(constants.gasAdjustment)
        .toFixed(0);

      return {
        amount: [
          {
            denom: chainGas.denom,
            amount: big(adjustedGas).mul(chainGas.gasPrice).toFixed(0),
          },
        ],
        gas: adjustedGas as Gas<string>,
      };
    },
    [chainGas, constants.gasAdjustment]
  );
};
