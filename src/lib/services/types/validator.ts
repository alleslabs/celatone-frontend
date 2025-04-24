import type { ConsensusPubkey, ValidatorData } from "lib/types";

import {
  BlockVote,
  SlashingEvent,
  zBechAddr,
  zBig,
  zCoin,
  zConsensusPubkey,
  zPagination,
  zProposalStatus,
  zProposalType,
  zRatio,
  zUtcDate,
  zValidatorAddr,
  zValidatorData,
} from "lib/types";
import { parseTxHash, snakeToCamel, valoperToAddr } from "lib/utils";
import { z } from "zod";

const zValidatorInfoRest = z
  .object({
    commission: z.object({
      commission_rates: z.object({
        max_change_rate: zRatio(z.coerce.number()),
        max_rate: zRatio(z.coerce.number()),
        rate: zRatio(z.coerce.number()),
      }),
      update_time: zUtcDate,
    }),
    consensus_pubkey: zConsensusPubkey,
    delegator_shares: zBig,
    description: z.object({
      details: z.string(),
      identity: z.string(),
      moniker: z.string(),
      security_contact: z.string(),
      website: z.string(),
    }),
    jailed: z.boolean(),
    min_self_delegation: z.string(),
    operator_address: zValidatorAddr,
    status: z.enum([
      "BOND_STATUS_BONDED",
      "BOND_STATUS_UNBONDING",
      "BOND_STATUS_UNBONDED",
    ]),
    tokens: zBig,
    unbonding_height: z.coerce.number(),
    unbonding_time: zUtcDate,
  })
  .transform<
    Omit<ValidatorData, "consensusAddress"> & {
      consensusPubkey: ConsensusPubkey;
    }
  >((val) => ({
    accountAddress: valoperToAddr(val.operator_address),
    commissionRate: val.commission.commission_rates.rate,
    consensusPubkey: val.consensus_pubkey,
    details: val.description.details,
    identity: val.description.identity,
    isActive: val.status === "BOND_STATUS_BONDED",
    isJailed: val.jailed,
    moniker: val.description.moniker.trim(),
    rank: null,
    validatorAddress: val.operator_address,
    votingPower: val.tokens,
    website: val.description.website,
  }));
export type ValidatorInfoRest = z.infer<typeof zValidatorInfoRest>;

export const zValidatorResponseRest = z.object({
  validator: zValidatorInfoRest,
});

export const zValidatorsResponseRest = z.object({
  pagination: zPagination,
  validators: z.array(zValidatorInfoRest),
});

export const zValidatorsResponse = z
  .object({
    items: z.array(zValidatorData),
    metadata: z.object({
      active_count: z.number().nonnegative(),
      inactive_count: z.number().nonnegative(),
      min_commission_rate: zRatio(z.coerce.number()),
      percent_33_rank: z.number().positive(),
      percent_66_rank: z.number().positive(),
      total_voting_power: zBig,
    }),
    total: z.number().nonnegative(),
  })
  .transform(snakeToCamel);
export type ValidatorsResponse = z.infer<typeof zValidatorsResponse>;

export const zValidatorDataResponse = z
  .object({
    info: zValidatorData.nullable(),
    self_voting_power: zBig,
    total_voting_power: zBig,
  })
  .transform(snakeToCamel);
export type ValidatorDataResponse = z.infer<typeof zValidatorDataResponse>;

export const zStakingProvisionsResponse = z
  .object({
    staking_provisions: zBig,
  })
  .transform(snakeToCamel);
export type StakingProvisionsResponse = z.infer<
  typeof zStakingProvisionsResponse
>;

export const zValidatorDelegatorsResponse = z.object({
  total: z.number().nonnegative(),
});
export type ValidatorDelegatorsResponse = z.infer<
  typeof zValidatorDelegatorsResponse
>;

export const zValidatorVotedProposalsResponseAnswerCounts = z
  .object({
    abstain: z.number(),
    all: z.number(),
    did_not_vote: z.number(),
    no: z.number(),
    no_with_veto: z.number(),
    weighted: z.number(),
    yes: z.number(),
  })
  .transform(snakeToCamel);

const zValidatorVotedProposalsResponseItem = z
  .object({
    abstain: z.number().nonnegative(),
    is_emergency: z.boolean().optional().default(false),
    is_expedited: z.boolean(),
    is_vote_weighted: z.boolean().default(false),
    no: z.number().nonnegative(),
    no_with_veto: z.number().nonnegative(),
    proposal_id: z.number().nonnegative(),
    status: zProposalStatus,
    timestamp: zUtcDate.nullable(),
    title: z.string(),
    tx_hash: z.string().nullable(),
    types: zProposalType.array(),
    yes: z.number().nonnegative(),
  })
  .transform((val) => ({
    ...snakeToCamel(val),
    txHash: val.tx_hash ? parseTxHash(val.tx_hash) : null,
  }));
export type ValidatorVotedProposalsResponseItem = z.infer<
  typeof zValidatorVotedProposalsResponseItem
>;

export const zValidatorVotedProposalsResponse = z.object({
  items: z.array(zValidatorVotedProposalsResponseItem),
  total: z.number().nonnegative(),
});
export type ValidatorVotedProposalsResponse = z.infer<
  typeof zValidatorVotedProposalsResponse
>;

export const zValidatorUptimeResponse = z
  .object({
    events: z
      .object({
        height: z.number(),
        timestamp: zUtcDate,
        type: z.nativeEnum(SlashingEvent),
      })
      .array(),
    recent_100_blocks: z
      .object({
        height: z.number(),
        vote: z.nativeEnum(BlockVote),
      })
      .array(),
    uptime: z.object({
      missed_blocks: z.number(),
      proposed_blocks: z.number(),
      signed_blocks: z.number(),
      total: z.number(),
    }),
  })
  .transform(snakeToCamel);
export type ValidatorUptimeResponse = z.infer<typeof zValidatorUptimeResponse>;

const zHistoricalPowersItem = z
  .object({
    hour_rounded_timestamp: zUtcDate,
    timestamp: zUtcDate,
    voting_power: zBig,
  })
  .transform(snakeToCamel);
export type HistoricalPowersItem = z.infer<typeof zHistoricalPowersItem>;

export const zHistoricalPowersResponse = z
  .object({
    items: z.array(zHistoricalPowersItem),
    total: z.number(),
  })
  .transform(snakeToCamel);
export type HistoricalPowersResponse = z.infer<
  typeof zHistoricalPowersResponse
>;

const zValidatorDelegationRelatedTxsResponseItem = z
  .object({
    height: z.number().positive(),
    messages: z.array(
      z.object({
        type: z.string(),
      })
    ),
    sender: zBechAddr,
    timestamp: zUtcDate,
    tokens: zCoin.array(),
    tx_hash: z.string().transform(parseTxHash),
  })
  .transform(snakeToCamel);
export type ValidatorDelegationRelatedTxsResponseItem = z.infer<
  typeof zValidatorDelegationRelatedTxsResponseItem
>;

export const zValidatorDelegationRelatedTxsResponse = z.object({
  items: z.array(zValidatorDelegationRelatedTxsResponseItem),
  total: z.number().nonnegative(),
});
export type ValidatorDelegationRelatedTxsResponse = z.infer<
  typeof zValidatorDelegationRelatedTxsResponse
>;
