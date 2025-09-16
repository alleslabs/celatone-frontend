import { zPagination } from "lib/types";
import { z } from "zod";

export const zDexApiCoin = z.object({
  denom: z.string(),
  metadata: z.string(),
  weight: z.number().optional(),
});

export const zDexApiPool = z.object({
  coins: z.array(zDexApiCoin),
  is_minitswap_pool: z.boolean(),
  liquidity: z.number(),
  lp: z.string(),
  lp_metadata: z.string(),
  pool_type: z.string(),
  staking_apr: z.number(),
  swap_fee_apr: z.number(),
  swap_fee_rate: z.number(),
  total_apr: z.number(),
  value_per_lp: z.number(),
  volume_24h: z.number(),
});

export const zDexApiPoolsResponse = z.object({
  pagination: zPagination,
  pools: z.array(zDexApiPool),
});
