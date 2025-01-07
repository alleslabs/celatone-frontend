import { z } from "zod";

import { zCoin, zPagination } from "lib/types";
import type { Option, TokenWithValue, USD } from "lib/types";

export const zBalancesResponse = z.array(zCoin);

export const zBalancesReponseLcd = z.object({
  balances: zBalancesResponse,
  pagination: zPagination.nullable(),
});

export interface BalanceInfos {
  error: Error;
  isLoading: boolean;
  supportedAssets: TokenWithValue[];
  totalData: Option<number>;
  totalSupportedAssetsValue: Option<USD<Big>>;
  unsupportedAssets: TokenWithValue[];
}
