import type Big from "big.js";
import type { SelectInputOption } from "lib/components/forms";
import type { Option, PoolInfo, Token, U, USD } from "lib/types";

import { z } from "zod";

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
        logo: Option<string>[];
        poolInfo: PoolInfo;
      }
  );

export interface AssetOptionValue {
  id: string;
  logo: string;
  formatted?: string;
  price?: string;
}

export type AssetOption = SelectInputOption<AssetOptionValue>;
