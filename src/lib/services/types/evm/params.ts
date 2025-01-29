import { zRatio } from "lib/types";
import { snakeToCamel } from "lib/utils";
import { z } from "zod";

export const zEvmParams = z
  .object({
    params: z.object({
      extra_eips: z.string().array(),
      allowed_publishers: z.string().array(),
      allow_custom_erc20: z.boolean(),
      allowed_custom_erc20s: z.string().array(),
      fee_denom: z.string(),
      gas_refund_ratio: zRatio(z.coerce.number()),
    }),
  })
  .transform(snakeToCamel);
