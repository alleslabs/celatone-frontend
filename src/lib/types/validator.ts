import { z } from "zod";

import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";

import { zBechAddr20, zValidatorAddr } from "./addrs";
import { zBig } from "./big";

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

export const zValidatorData = z
  .object({
    rank: z.number().nullable(),
    rank_cummulative_voting_power: zBig,
    validator_address: zValidatorAddr,
    account_address: zBechAddr20,
    identity: z.string(),
    moniker: z.string(),
    details: z.string(),
    commission_rate: z.coerce.number(),
    is_jailed: z.boolean(),
    is_active: z.boolean(),
    voting_power: zBig,
    uptime: z.number().optional(),
  })
  .transform(snakeToCamel);

export type ValidatorData = z.infer<typeof zValidatorData>;
