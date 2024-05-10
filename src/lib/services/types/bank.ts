import type { Coin } from "@cosmjs/stargate";
import { z } from "zod";

import { zPagination } from "lib/types";
import type { Option, TokenWithValue, USD } from "lib/types";

export const zBalancesResponse = z
  .array(
    z.object({
      amount: z.string(),
      denom: z.string(),
    })
  )
  .transform<Coin[]>((balances) => balances);

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
