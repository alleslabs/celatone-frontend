import type { BigSource } from "big.js";

import type { Token, U } from "lib/types";

import { formatUTokenWithPrecision } from "./token";

export function formatToken(
  amount: U<Token<BigSource>>,
  denom: string
): string {
  if (denom[0] === "u") {
    return formatUTokenWithPrecision(amount, 6);
  }
  return formatUTokenWithPrecision(amount, 0);
}
