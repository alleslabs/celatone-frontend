import big from "big.js";
import { z } from "zod";

import { zBechAddr20, zValidatorAddr } from "./addrs";

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
    rank_cummulative_voting_power: z.string().nullable(),
    validator_address: zValidatorAddr,
    account_address: zBechAddr20,
    identity: z.string(),
    moniker: z.string(),
    details: z.string(),
    commission_rate: z.coerce.number(),
    is_jailed: z.boolean(),
    is_active: z.boolean(),
    voting_power: z.string(),
    uptime: z.number().optional(),
  })
  .transform(
    ({
      rank,
      rank_cummulative_voting_power,
      validator_address,
      account_address,
      identity,
      moniker,
      details,
      commission_rate,
      is_jailed,
      is_active,
      voting_power,
      uptime,
    }) => ({
      rank,
      rankCummulativeVotingPower: rank_cummulative_voting_power,
      validatorAddress: validator_address,
      accountAddress: account_address,
      identity,
      moniker,
      details,
      commissionRate: commission_rate,
      isJailed: is_jailed,
      isActive: is_active,
      votingPower: big(voting_power),
      uptime,
    })
  );

export type ValidatorData = z.infer<typeof zValidatorData>;
