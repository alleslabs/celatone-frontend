import type Big from "big.js";

import type { LPDetails, Option, Token, U, USD } from "lib/types";

export type TokenWithValue =
  | {
      isLpToken?: false;
      denom: string;
      amount: U<Token<Big>>;
      symbol: Option<string>;
      logo: Option<string>;
      precision: Option<number>;
      price?: Option<USD<Big>>;
      value: Option<USD<Big>>;
    }
  | {
      isLpToken: true;
      denom: string;
      amount: U<Token<Big>>;
      symbol: Option<string>;
      logo: Option<string[]>;
      precision: Option<number>;
      price?: Option<USD<Big>>;
      value: Option<USD<Big>>;
      lpDetails: LPDetails;
    };
