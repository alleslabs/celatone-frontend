import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { formatUrl } from "lib/utils/formatter/url";
import { z } from "zod";

import type { Ratio } from "./currency";

import { zPubkeySingle } from "./account";
import { zBechAddr20, zConsensusAddr, zValidatorAddr } from "./addrs";
import { zBig } from "./big";
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
export type ConsensusPubkey = z.infer<typeof zConsensusPubkey>;

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
