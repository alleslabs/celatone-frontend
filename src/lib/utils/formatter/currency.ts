import type { Big, BigSource } from "big.js";

import { big } from "lib/types";
import type { NominalType, Option, Token, U } from "lib/types";

/* eslint-disable */
export function exponentify<T extends Token<BigSource>>(
  amount: T,
  precision: Option<number>
): T extends NominalType<infer N> ? U<Big & NominalType<N>> : U<T> {
  return big(amount).mul(big(10).pow(precision ?? 0)) as any;
}

export function deexponentify<T extends Token<BigSource>>(
  amount: U<T>,
  precision: Option<number>
): T extends NominalType<infer N> ? Big & NominalType<N> : T {
  return big(amount).div(big(10).pow(precision ?? 0)) as any;
}
