import type { BigSource } from "big.js";

import type { Token, U } from "lib/types";

import { demicrofy } from "./currency";

export function formatUToken(n: U<Token<BigSource>>): string {
  return demicrofy(n).toFixed(6);
}
