import type Big from "big.js";

import type { Option, Token, U, USD } from "lib/types";

export interface TokenWithValue {
  denom: string;
  amount: U<Token<Big>>;
  logo: Option<string>;
  precision: Option<number>;
  value: Option<USD<Big>>;
}
