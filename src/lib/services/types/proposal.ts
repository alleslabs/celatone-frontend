import type {
  Coin,
  Proposal,
  ProposalData,
  ProposalDeposit,
  ProposalParams,
  ProposalStatus,
  ProposalValidatorVote,
  ProposalVote,
  ProposalVotesInfo,
} from "lib/types";

import {
  zBechAddr,
  zBig,
  zCoin,
  zMessageResponse,
  zProposalStatus,
  zProposalType,
  zRatio,
  zUtcDate,
  zValidator,
} from "lib/types";
import { zPagination } from "lib/types/rest";
import { parseTxHash, snakeToCamel } from "lib/utils";
import { capitalize } from "lodash";
import { z } from "zod";

export const zProposalParamsResponse = z
  .object({
    // emergency - only in initia
    emergency_min_deposit: zCoin.array().optional(),
    emergency_tally_interval: z.string().optional(),
    expedited_min_deposit: zCoin.array().optional(),
    expedited_quorum: zRatio(z.coerce.number()).optional(), // only in sei
    expedited_threshold: zRatio(z.coerce.number()).optional(),
    // expedited
    expedited_voting_period: z.string().optional(),
    max_deposit_period: z.string(),
    min_deposit: zCoin.array(),
    min_initial_deposit_ratio: z.coerce.number(),
    quorum: zRatio(z.coerce.number()),
    threshold: zRatio(z.coerce.number()),
    veto_threshold: zRatio(z.coerce.number()),
    voting_period: z.string(),
  })
  .transform<ProposalParams<Coin>>(snakeToCamel);

export const zProposalParamsResponseRest = z.object({
  params: zProposalParamsResponse,
});

export const zProposal = z.object({
  deposit_end_time: zUtcDate,
  id: z.number().nonnegative(),
  is_emergency: z.boolean().optional().default(false),
  is_expedited: z.boolean(),
  proposer: zBechAddr,
  resolved_height: z.number().nullable(),
  status: zProposalStatus,
  title: z.string(),
  types: zProposalType.array(),
  voting_end_time: zUtcDate.nullable(),
});

export const zProposalsResponseItem =
  zProposal.transform<Proposal>(snakeToCamel);

export const zProposalsResponse = z.object({
  items: z.array(zProposalsResponseItem),
  total: z.number().nonnegative(),
});
export type ProposalsResponse = z.infer<typeof zProposalsResponse>;

export const zRelatedProposalsResponse = z.object({
  items: z.array(zProposalsResponseItem),
});
export type RelatedProposalsResponse = z.infer<
  typeof zRelatedProposalsResponse
>;

export const zProposalDataResponse = z.object({
  info: zProposal
    .extend({
      abstain: zBig,
      created_height: z.number().nullable(),
      created_timestamp: zUtcDate.nullable(),
      created_tx_hash: z.string().nullable(),
      description: z.string(),
      failed_reason: z.string(),
      messages: z.array(zMessageResponse).nullable(),
      metadata: z.string(),
      no: zBig,
      no_with_veto: zBig,
      proposal_deposits: z
        .object({
          amount: zCoin.array(),
          depositor: zBechAddr,
          timestamp: zUtcDate,
          tx_hash: z.string(),
        })
        .array(),
      resolved_timestamp: zUtcDate.nullable(),
      resolved_total_voting_power: zBig.nullable(),
      submit_time: zUtcDate,
      total_deposit: zCoin.array(),
      version: z.string(),
      voting_time: zUtcDate.nullable(),
      yes: zBig,
    })
    .transform<ProposalData<Coin>>(
      ({ created_tx_hash, messages, proposal_deposits, ...val }) => ({
        ...snakeToCamel(val),
        createdTxHash: created_tx_hash ? parseTxHash(created_tx_hash) : null,
        finalTallyResult: {
          abstain: val.abstain,
          no: val.no,
          noWithVeto: val.no_with_veto,
          totalVotingPower: val.resolved_total_voting_power,
          yes: val.yes,
        },
        messages,
        proposalDeposits: proposal_deposits.map((deposit) => ({
          amount: deposit.amount,
          depositor: deposit.depositor,
          timestamp: deposit.timestamp,
          txHash: parseTxHash(deposit.tx_hash),
        })),
      })
    )
    .nullable(),
});
export type ProposalDataResponse = z.infer<typeof zProposalDataResponse>;

export const zProposalVotesInfoResponse = z
  .object({
    abstain: zBig,
    current_total_voting_power: zBig.nullable(),
    no: zBig,
    no_with_veto: zBig,
    yes: zBig,
  })
  .transform<ProposalVotesInfo>((val) => ({
    ...snakeToCamel(val),
    totalVotingPower: val.current_total_voting_power,
  }));

export const zProposalVotesInfoResponseRest = z
  .tuple([
    z.object({
      tally: z.object({
        abstain_count: zBig,
        no_count: zBig,
        no_with_veto_count: zBig,
        yes_count: zBig,
      }),
    }),
    z.object({
      pool: z.object({
        bonded_tokens: zBig,
        not_bonded_tokens: zBig,
      }),
    }),
  ])
  .transform<ProposalVotesInfo>(([tally, pool]) => ({
    abstain: tally.tally.abstain_count,
    no: tally.tally.no_count,
    noWithVeto: tally.tally.no_with_veto_count,
    totalVotingPower: pool.pool.bonded_tokens,
    yes: tally.tally.yes_count,
  }));

const zProposalVotesResponseItem = z
  .object({
    abstain: z.number().nonnegative(),
    is_vote_weighted: z.boolean(),
    no: z.number().nonnegative(),
    no_with_veto: z.number().nonnegative(),
    proposal_id: z.number().nonnegative(),
    timestamp: zUtcDate.nullable(),
    tx_hash: z.string().nullable(),
    validator: zValidator.nullable(),
    voter: zBechAddr.nullable(),
    yes: z.number().nonnegative(),
  })
  .transform<ProposalVote>((val) => ({
    ...snakeToCamel(val),
    txHash: val.tx_hash ? parseTxHash(val.tx_hash) : null,
  }));

export const zProposalVotesResponse = z.object({
  items: z.array(zProposalVotesResponseItem),
  total: z.number().nonnegative(),
});
export type ProposalVotesResponse = z.infer<typeof zProposalVotesResponse>;

export interface ProposalValidatorVotesResponse {
  items: ProposalValidatorVote[];
  total: number;
}

const zProposalAnswerCounts = z.object({
  abstain: z.number().nonnegative(),
  no: z.number().nonnegative(),
  no_with_veto: z.number().nonnegative(),
  total: z.number().nonnegative(),
  weighted: z.number().nonnegative(),
  yes: z.number().nonnegative(),
});

export const zProposalAnswerCountsResponse = z
  .object({
    all: zProposalAnswerCounts,
    validator: zProposalAnswerCounts.extend({
      did_not_vote: z.number().nonnegative(),
      total_validators: z.number().nonnegative(),
    }),
  })
  .transform(snakeToCamel);
export type ProposalAnswerCountsResponse = z.infer<
  typeof zProposalAnswerCountsResponse
>;

const zProposalFinalTallyResultBase = z.object({
  abstain_count: zBig,
  no_count: zBig,
  no_with_veto_count: zBig,
  yes_count: zBig,
});

const zProposalFinalTallyResultCosmos = zProposalFinalTallyResultBase.transform(
  (val) => ({
    abstain: val.abstain_count,
    no: val.no_count,
    noWithVeto: val.no_with_veto_count,
    totalVotingPower: null,
    yes: val.yes_count,
  })
);

const zProposalFinalTallyResultInitia = z
  .object({
    tally_height: z.coerce.number(),
    total_staking_power: zBig,
    total_vesting_power: zBig,
    v1_tally_result: zProposalFinalTallyResultBase,
  })
  .transform((val) => ({
    abstain: val.v1_tally_result.abstain_count,
    no: val.v1_tally_result.no_count,
    noWithVeto: val.v1_tally_result.no_with_veto_count,
    totalVotingPower: val.total_staking_power.add(val.total_vesting_power),
    yes: val.v1_tally_result.yes_count,
  }));

export const zProposalDataResponseRest = z
  .object({
    deposit_end_time: zUtcDate,
    expedited: z.boolean().optional().default(false),
    final_tally_result: z.union([
      zProposalFinalTallyResultCosmos,
      zProposalFinalTallyResultInitia,
    ]),
    id: z.coerce.number(),
    messages: z.array(zMessageResponse).nullable(),
    metadata: z.string(),
    proposer: zBechAddr,
    status: z.string(),
    submit_time: zUtcDate,
    summary: z.string(),
    title: z.string(),
    total_deposit: zCoin.array(),
    voting_end_time: zUtcDate.nullable(),
    voting_start_time: zUtcDate.nullable(),
  })
  .transform<ProposalData<Coin>>((val) => ({
    ...snakeToCamel(val),
    createdHeight: null,
    createdTimestamp: null,
    createdTxHash: null,
    description: val.summary,
    failedReason: "",
    isEmergency: false,
    isExpedited: val.expedited,
    proposalDeposits: [],
    resolvedHeight: null,
    resolvedTimestamp: null,
    status: val.status
      .replace("PROPOSAL_STATUS_", "")
      .split("_")
      .map((term: string) => capitalize(term.toLowerCase()))
      .join("") as ProposalStatus,
    types: val.messages?.map((msg) => msg["@type"]) ?? [],
    votingTime: val.voting_start_time,
  }));
export type ProposalDataResponseRest = z.infer<
  typeof zProposalDataResponseRest
>;

export const zProposalsResponseRest = z.object({
  pagination: zPagination,
  proposals: z.array(zProposalDataResponseRest),
});
export type ProposalsResponseRest = z.infer<typeof zProposalsResponseRest>;

export const zProposalDepositsResponseRest = z.object({
  deposits: z.array(
    z
      .object({
        amount: zCoin.array(),
        depositor: zBechAddr,
      })
      .transform<ProposalDeposit<Coin>>((deposit) => deposit)
  ),
  pagination: zPagination,
});
