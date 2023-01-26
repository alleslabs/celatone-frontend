import type { BigSource } from "big.js";

import type { Token, U } from "lib/types";

import { formatTokenWithPrecision } from "./token";

export function formatToken(
  amount: U<Token<BigSource>>,
  denom: string
): string {
  if (denom[0] === "u") {
    return formatTokenWithPrecision(amount, 6);
  }
  return amount.toString();
}
