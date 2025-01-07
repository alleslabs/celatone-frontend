import type Big from "big.js";
import { z } from "zod";

import type { SelectInputOption } from "lib/components/forms";
import type { Option, PoolInfo, Token, U, USD } from "lib/types";

export const zCoin = z.object({
  amount: z.string(),
  denom: z.string(),
});
export type Coin = z.infer<typeof zCoin>;

export const zAssetInfo = z.object({
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
export type AssetInfo = z.infer<typeof zAssetInfo>;
export type AssetInfos = Record<string, AssetInfo>;

export type AssetOption = SelectInputOption<AssetOptionValue>;

export interface AssetOptionValue {
  formatted?: string;
  id: string;
  logo: string;
  price?: string;
}

export type TokenWithValue = BaseTokenWithValue &
  (
    | {
        isLPToken: false;
        logo: Option<string>;
      }
    | {
        isLPToken: true;
        logo: Option<string>[];
        poolInfo: PoolInfo;
      }
  );

interface BaseTokenWithValue {
  amount: U<Token<Big>>;
  denom: string;
  precision: Option<number>;
  price: Option<USD<Big>>;
  symbol: Option<string>;
  value: Option<USD<Big>>;
}
