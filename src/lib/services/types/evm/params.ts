import { z } from "zod";

export const zEvmParams = z.object({
  params: z.object({
    extra_eips: z.string().array(),
    allowed_publishers: z.string().array(),
    allow_custom_erc20: z.literal(true),
    allowed_custom_erc20s: z.string().array(),
    fee_denom: z.string(),
  }),
});
