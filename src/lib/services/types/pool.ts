import { PoolType, zBechAddr, zBechAddr32, zCoin } from "lib/types";
import { snakeToCamel } from "lib/utils";
import { z } from "zod";

const zPoolBase = z.object({
  contract_address: zBechAddr32.nullable(),
  id: z.number().positive(),
  is_superfluid: z.boolean(),
  liquidity: zCoin.array(),
  type: z.nativeEnum(PoolType),
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
        address: zBechAddr32,
        contract_address: zBechAddr32.nullable(),
        created_height: z.number().positive(),
        creator: zBechAddr,
        exit_fee: z.string(),
        future_pool_governor: z.string(),
        is_supported: z.boolean(),
        scaling_factor_controller: z.string().nullable(),
        scaling_factors: z.number().array().nullable(),
        smooth_weight_change_params: z.object({}).passthrough().nullable(),
        spread_factor: z.string().nullable(),
        swap_fee: z.string(),
        tick_spacing: z.number().nullable(),
        weight: z
          .object({
            denom: z.string(),
            weight: z.string(),
          })
          .array()
          .nullable(),
      })
      .nullable(),
  })
  .transform(snakeToCamel);

export const zPoolsLiquidityResponse = z
  .object({
    items: zPoolBase.pick({ id: true, liquidity: true }).array(),
  })
  .transform(snakeToCamel);
