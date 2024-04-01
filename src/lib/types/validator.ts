import { z } from "zod";

import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { formatUrl } from "lib/utils/formatter/url";

import { zBechAddr20, zValidatorAddr } from "./addrs";
import { zBig } from "./big";
import { zRatio } from "./currency";
import type { Ratio } from "./currency";

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
    validator_address: zValidatorAddr,
    account_address: zBechAddr20,
    identity: z.string(),
    moniker: z.string(),
    details: z.string(),
    commission_rate: zRatio(z.coerce.number()),
    is_jailed: z.boolean(),
    is_active: z.boolean(),
    voting_power: zBig,
    uptime: z.number().optional(),
    website: z.string(),
  })
  .transform(({ website, ...val }) => ({
    ...snakeToCamel(val),
    website: formatUrl(website),
  }));

export type ValidatorData = z.infer<typeof zValidatorData>;

export enum BlockVote {
  PROPOSE = "PROPOSE",
  VOTE = "VOTE",
  ABSTAIN = "ABSTAIN",
}

export type ComputedUptime = {
  signed: number;
  proposed: number;
  missed: number;
  signedRatio: Ratio<number>;
  proposedRatio: Ratio<number>;
  missedRatio: Ratio<number>;
  uptimeRatio: Ratio<number>;
};
