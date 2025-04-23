import { z } from "zod";

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

const zValidatorInfoRest = z
  .object({
    operator_address: zValidatorAddr,
    consensus_pubkey: zConsensusPubkey,
    jailed: z.boolean(),
    status: z.enum([
      "BOND_STATUS_BONDED",
      "BOND_STATUS_UNBONDING",
      "BOND_STATUS_UNBONDED",
    ]),
    tokens: zBig,
    delegator_shares: zBig,
    description: z.object({
      moniker: z.string(),
      identity: z.string(),
      website: z.string(),
      security_contact: z.string(),
      details: z.string(),
    }),
    unbonding_height: z.coerce.number(),
    unbonding_time: zUtcDate,
    commission: z.object({
      commission_rates: z.object({
        rate: zRatio(z.coerce.number()),
        max_rate: zRatio(z.coerce.number()),
        max_change_rate: zRatio(z.coerce.number()),
      }),
      update_time: zUtcDate,
    }),
    min_self_delegation: z.string(),
  })
  .transform<
    Omit<ValidatorData, "consensusAddress"> & {
      consensusPubkey: ConsensusPubkey;
    }
  >((val) => ({
    rank: null,
    validatorAddress: val.operator_address,
    accountAddress: valoperToAddr(val.operator_address),
    identity: val.description.identity,
    moniker: val.description.moniker.trim(),
    details: val.description.details,
    commissionRate: val.commission.commission_rates.rate,
    isJailed: val.jailed,
    isActive: val.status === "BOND_STATUS_BONDED",
    votingPower: val.tokens,
    website: val.description.website,
    consensusPubkey: val.consensus_pubkey,
  }));
export type ValidatorInfoRest = z.infer<typeof zValidatorInfoRest>;

export const zValidatorResponseRest = z.object({
  validator: zValidatorInfoRest,
});

export const zValidatorsResponseRest = z.object({
  validators: z.array(zValidatorInfoRest),
  pagination: zPagination,
});

export const zValidatorsResponse = z
  .object({
    items: z.array(zValidatorData),
    total: z.number().nonnegative(),
    metadata: z.object({
      total_voting_power: zBig,
      active_count: z.number().nonnegative(),
      inactive_count: z.number().nonnegative(),
      percent_33_rank: z.number().positive(),
      percent_66_rank: z.number().positive(),
      min_commission_rate: zRatio(z.coerce.number()),
    }),
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
    all: z.number(),
    yes: z.number(),
    no: z.number(),
    no_with_veto: z.number(),
    abstain: z.number(),
    did_not_vote: z.number(),
    weighted: z.number(),
  })
  .transform(snakeToCamel);

const zValidatorVotedProposalsResponseItem = z
  .object({
    proposal_id: z.number().nonnegative(),
    abstain: z.number().nonnegative(),
    is_expedited: z.boolean(),
    is_emergency: z.boolean().optional().default(false),
    is_vote_weighted: z.boolean().default(false),
    no: z.number().nonnegative(),
    no_with_veto: z.number().nonnegative(),
    status: zProposalStatus,
    timestamp: zUtcDate.nullable(),
    title: z.string(),
    tx_hash: z.string().nullable(),
    yes: z.number().nonnegative(),
    types: zProposalType.array(),
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
    uptime: z.object({
      signed_blocks: z.number(),
      proposed_blocks: z.number(),
      missed_blocks: z.number(),
      total: z.number(),
    }),
    recent_100_blocks: z
      .object({
        height: z.number(),
        vote: z.nativeEnum(BlockVote),
      })
      .array(),
    events: z
      .object({
        height: z.number(),
        timestamp: zUtcDate,
        type: z.nativeEnum(SlashingEvent),
      })
      .array(),
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
    tx_hash: z.string().transform(parseTxHash),
    height: z.number().positive(),
    tokens: zCoin.array(),
    timestamp: zUtcDate,
    messages: z.array(
      z.object({
        type: z.string(),
      })
    ),
    sender: zBechAddr,
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
