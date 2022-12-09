import type { ChainGas, Gas } from "lib/types";

export const GAS_ADJUSTMENT = 1.6;

export const FALLBACK_GAS_REGISTRY: Record<string, ChainGas> = {
  osmosistestnet: {
    denom: "uosmo",
    gasPrice: 0.025 as Gas<number>,
  },
  terra2: {
    denom: "uluna",
    gasPrice: 0.15 as Gas<number>,
  },
};
