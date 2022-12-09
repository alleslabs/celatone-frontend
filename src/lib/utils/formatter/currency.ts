import type { Big, BigSource } from "big.js";
import big from "big.js";

import { MICRO } from "lib/data";
import type { NominalType, Token, U } from "lib/types";

/* eslint-disable */
export function microfy<T extends Token<BigSource>>(
  amount: T
): T extends NominalType<infer N> ? U<Big & NominalType<N>> : U<T> {
  return big(amount).mul(MICRO) as any;
}

export function demicrofy<T extends Token<BigSource>>(
  amount: U<T>
): T extends NominalType<infer N> ? Big & NominalType<N> : T {
  return big(amount).div(MICRO) as any;
}
