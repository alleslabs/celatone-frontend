import { z } from "zod";

import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { formatUrl } from "lib/utils/formatter/url";

import { zPubkeySingle } from "./account";
import { zBechAddr20, zConsensusAddr, zValidatorAddr } from "./addrs";
import { zBig } from "./big";
import type { Ratio } from "./currency";
import { zRatio } from "./currency";

export const zValidator = z
  .object({
    identity: z.string().nullable(),
    moniker: z.string().nullable(),
    validator_address: zValidatorAddr,
  })
  .transform((val) => ({
    identity: val.identity ?? undefined,
    moniker: val.moniker ?? undefined,
    validatorAddress: val.validator_address,
  }));
export type Validator = z.infer<typeof zValidator>;

export const zValidatorData = z
  .object({
    account_address: zBechAddr20,
    commission_rate: zRatio(z.coerce.number()),
    consensus_address: zConsensusAddr,
    details: z.string(),
    identity: z.string(),
    is_active: z.boolean(),
    is_jailed: z.boolean(),
    moniker: z.string(),
    rank: z.number().nullable(),
    uptime: z.number().optional(),
    validator_address: zValidatorAddr,
    voting_power: zBig,
    website: z.string(),
  })
  .transform(({ website, ...val }) => ({
    ...snakeToCamel(val),
    website: formatUrl(website),
  }));
export type ValidatorData = z.infer<typeof zValidatorData>;

export const zConsensusPubkey = zPubkeySingle;
export enum BlockVote {
  ABSTAIN = "ABSTAIN",
  PROPOSE = "PROPOSE",
  VOTE = "VOTE",
}

export enum SlashingEvent {
  Jailed = "Jailed",
  Slashed = "Slashed",
  Unjailed = "Unjailed",
}

export type ComputedUptime = {
  missed: number;
  missedRatio: Ratio<number>;
  proposed: number;
  proposedRatio: Ratio<number>;
  signed: number;
  signedRatio: Ratio<number>;
  uptimeRatio: Ratio<number>;
};

export type ConsensusPubkey = z.infer<typeof zConsensusPubkey>;
