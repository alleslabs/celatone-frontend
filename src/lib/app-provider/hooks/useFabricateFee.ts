import type { StdFee } from "@cosmjs/stargate";
import big from "big.js";
import { useCallback } from "react";

import { GAS_ADJUSTMENT } from "lib/data/gas";
import type { Gas } from "lib/types";

import { useChainGas } from "./useChainGas";

export const useFabricateFee = () => {
  const chainFee = useChainGas();

  return useCallback(
    (estimatedGas: number): StdFee => {
      const adjustedGas = big(estimatedGas).mul(GAS_ADJUSTMENT).toFixed(0);

      return {
        amount: [
          {
            denom: chainFee.denom,
            amount: big(adjustedGas).mul(chainFee.gasPrice).toFixed(0),
          },
        ],
        gas: adjustedGas as Gas<string>,
      };
    },
    [chainFee]
  );
};
