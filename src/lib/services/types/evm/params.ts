import { z } from "zod";

export const zEvmParams = z.object({
  params: z.object({
    allow_custom_erc20: z.boolean(),
    allowed_custom_erc20s: z.string().array(),
    allowed_publishers: z.string().array(),
    extra_eips: z.string().array(),
    fee_denom: z.string(),
  }),
});
