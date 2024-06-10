import { z } from "zod";

import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { formatUrl } from "lib/utils/formatter/url";

import type { BechAddr20, ValidatorAddr } from "./addrs";
import { zBechAddr20, zValidatorAddr } from "./addrs";
import { zBig } from "./big";
import type { Nullable, Option } from "./common";
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

export type ValidatorData = {
  rank: Nullable<number>;
  validatorAddress: ValidatorAddr;
  accountAddress: BechAddr20;
  identity: string;
  moniker: string;
  details: string;
  commissionRate: Ratio<number>;
  // NOTE: consensusPubkey is present only in the lcd response
  consensusPubkey: Option<{
    "@type": string;
    key: string;
  }>;
  isJailed: boolean;
  isActive: boolean;
  votingPower: Big;
  uptime?: number;
  website: string;
};

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
  .transform<ValidatorData>(({ website, ...val }) => ({
    ...snakeToCamel(val),
    website: formatUrl(website),
    consensusPubkey: undefined,
  }));

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

export enum SlashingEvent {
  Unjailed = "Unjailed",
  Jailed = "Jailed",
  Slashed = "Slashed",
}
