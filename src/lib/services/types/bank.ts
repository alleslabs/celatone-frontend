import { z } from "zod";

import { zCoin, zPagination } from "lib/types";
import type { Option, TokenWithValue, USD } from "lib/types";

export const zBalancesResponse = z.array(zCoin);

export const zBalancesReponseLcd = z.object({
  balances: zBalancesResponse,
  pagination: zPagination,
});

export interface BalanceInfos {
  supportedAssets: TokenWithValue[];
  totalSupportedAssetsValue: Option<USD<Big>>;
  unsupportedAssets: TokenWithValue[];
  isLoading: boolean;
  totalData: Option<number>;
  error: Error;
}
