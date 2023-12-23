import { z } from "zod";

import { zValidatorAddr } from "./addrs";

export const zValidator = z
  .object({
    validator_address: zValidatorAddr,
    identity: z.string().nullable(),
    moniker: z.string().nullable(),
  })
  .transform((val) => ({
    validatorAddress: val.validator_address,
    identity: val.identity ?? undefined,
    moniker: val.moniker ?? undefined,
  }));

export type Validator = z.infer<typeof zValidator>;
