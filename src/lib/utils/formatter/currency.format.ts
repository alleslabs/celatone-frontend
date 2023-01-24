import type { BigSource } from "big.js";

import type { Token, U } from "lib/types";

import { demicrofy } from "./currency";

export function formatToken(
  amount: U<Token<BigSource>>,
  denom: string
): string {
  if (denom[0] === "u") {
    return demicrofy(amount).toFixed(6);
  }
  return amount.toString();
}
