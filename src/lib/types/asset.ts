import type Big from "big.js";

import type { LPDetails, Option, Token, U, USD } from "lib/types";

interface BaseTokenWithValue {
  denom: string;
  amount: U<Token<Big>>;
  symbol: Option<string>;
  precision: Option<number>;
  price: Option<USD<Big>>;
  value: Option<USD<Big>>;
}

export type TokenWithValue = BaseTokenWithValue &
  (
    | {
        isLPToken: false;
        logo: Option<string>;
      }
    | {
        isLPToken: true;
        logo: Option<string[]>;
        lpDetails: LPDetails;
      }
  );
