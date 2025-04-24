import type { Option, TokenWithValue, USD } from "lib/types";

import { zCoin, zPagination } from "lib/types";
import { z } from "zod";

export const zBalancesResponse = z.array(zCoin);

export const zBalancesReponseRest = z.object({
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
