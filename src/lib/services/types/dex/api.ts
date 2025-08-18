import { zPagination } from "lib/types";
import { z } from "zod";

export const zDexApiCoin = z.object({
  denom: z.string(),
  metadata: z.string(),
  weight: z.string().optional(),
});

export const zDexApiPool = z.object({
  coins: z.array(zDexApiCoin),
  is_minitswap_pool: z.boolean(),
  lp: z.string(),
  lp_metadata: z.string(),
  pool_type: z.string(),
});

export const zDexApiPoolsResponse = z.object({
  pagination: zPagination,
  pools: z.array(zDexApiPool),
});
