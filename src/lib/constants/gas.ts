import type { Token, U } from "lib/types";

export const GAS_ADJUSTMENT = 1.6;

export const FALLBACK_GAS_PRICE: Record<
  string,
  { denom: string; gasPrice: string }
> = {
  osmosis: {
    denom: "uosmo",
    gasPrice: "0.025" as U<Token>,
  },
  osmosistestnet: {
    denom: "uosmo",
    gasPrice: "0.025" as U<Token>,
  },
  terra2: {
    denom: "uluna",
    gasPrice: "0.15" as U<Token>,
  },
};
