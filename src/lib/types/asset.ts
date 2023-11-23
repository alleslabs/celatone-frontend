import type Big from "big.js";
import { z } from "zod";

import type { LPDetails, Option, Token, U, USD } from "lib/types";

export const AssetInfoSchema = z.object({
  coingecko: z.string(),
  description: z.string(),
  id: z.string(),
  logo: z.string(),
  name: z.string(),
  precision: z.number(),
  price: z.number().nonnegative(),
  slugs: z.array(z.string()),
  symbol: z.string(),
  type: z.string(),
});
export type AssetInfo = z.infer<typeof AssetInfoSchema>;

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
