import { z } from "zod";

import { PoolType, zBechAddr, zBechAddr32, zCoin } from "lib/types";
import { snakeToCamel } from "lib/utils";

const zPoolBase = z.object({
  id: z.number().positive(),
  type: z.nativeEnum(PoolType),
  is_superfluid: z.boolean(),
  liquidity: zCoin.array(),
  contract_address: zBechAddr32.nullable(),
});

export const zPoolsResponse = z
  .object({
    items: zPoolBase.array(),
    total: z.number(),
  })
  .transform(snakeToCamel);
export type PoolsResponse = z.infer<typeof zPoolsResponse>;

export const zPoolDataResponse = z
  .object({
    info: zPoolBase
      .extend({
        is_supported: z.boolean(),
        created_height: z.number().positive(),
        creator: zBechAddr,
        address: zBechAddr32,
        swap_fee: z.string(),
        exit_fee: z.string(),
        future_pool_governor: z.string(),
        weight: z
          .object({
            denom: z.string(),
            weight: z.string(),
          })
          .array()
          .nullable(),
        smooth_weight_change_params: z.object({}).passthrough().nullable(),
        scaling_factors: z.string().array().nullable(),
        scaling_factor_controller: z.string().nullable(),
        spread_factor: z.string().nullable(),
        tick_spacing: z.number().nullable(),
        contract_address: zBechAddr32.nullable(),
      })
      .nullable(),
  })
  .transform(snakeToCamel);

export const zPoolsLiquidityResponse = z
  .object({
    items: zPoolBase.pick({ id: true, liquidity: true }).array(),
  })
  .transform(snakeToCamel);
