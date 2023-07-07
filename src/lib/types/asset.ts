import type Big from "big.js";

import type { Option, Token, U, USD } from "lib/types";

export interface TokenWithValue {
  denom: string;
  amount: U<Token<Big>>;
  symbol: Option<string>;
  logo: Option<string>;
  precision: Option<number>;
  price?: Option<USD<Big>>;
  value: Option<USD<Big>>;
}
