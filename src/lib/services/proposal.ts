import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import big from "big.js";
import { z } from "zod";

import {
  zBechAddr,
  zCoin,
  zProposalStatus,
  zProposalType,
  zUtcDate,
  zValidator,
} from "lib/types";
import type {
  AccessConfigPermission,
  BechAddr,
  BechAddr32,
  SnakeToCamelCaseNested,
  Proposal,
  Option,
  BechAddr20,
  ProposalData,
  ProposalStatus,
  ProposalType,
  ProposalVote,
  ProposalParams,
  ProposalVotesInfo,
} from "lib/types";
import { parseTxHash, snakeToCamel } from "lib/utils";

interface DepositParams {
  min_deposit: Coin[];
  max_deposit_period: string;
  min_expedited_deposit: Coin[];
  min_initial_deposit_ratio: string;
}

export type DepositParamsInternal = SnakeToCamelCaseNested<DepositParams>;

export const fetchGovDepositParams = (
  lcdEndpoint: string
): Promise<DepositParamsInternal> =>
  axios
    .get<{
      deposit_params: DepositParams;
    }>(`${lcdEndpoint}/cosmos/gov/v1beta1/params/deposit`)
    .then(({ data }) => snakeToCamel(data.deposit_params));

interface ProposalVotingPeriod {
  proposal_type: string;
  voting_period: string;
}

interface VotingParams {
  voting_period: string;
  proposal_voting_periods: ProposalVotingPeriod[];
  expedited_voting_period: string;
}

export type VotingParamsInternal = SnakeToCamelCaseNested<VotingParams>;

export const fetchGovVotingParams = (
  lcdEndpoint: string
): Promise<VotingParamsInternal> =>
  axios
    .get<{
      voting_params: VotingParams;
    }>(`${lcdEndpoint}/cosmos/gov/v1beta1/params/voting`)
    .then(({ data }) => snakeToCamel(data.voting_params));

export interface UploadAccess {
  permission: AccessConfigPermission;
  address: BechAddr;
  addresses?: BechAddr[];
}

export const fetchGovUploadAccessParams = async (
  lcdEndpoint: string
): Promise<UploadAccess> =>
  axios.get(`${lcdEndpoint}/upload_access`).then(({ data }) => data);

const zProposalParamsResponse = z
  .object({
    min_deposit: zCoin.array(),
    min_initial_deposit_ratio: z.coerce.number(),
    max_deposit_period: z.string(),
    voting_period: z.string(),
    veto_threshold: z.coerce.number(),
    quorum: z.coerce.number(),
    threshold: z.coerce.number(),
    // expedited
    expedited_voting_period: z.string().optional(),
    expedited_threshold: z.coerce.number().optional(),
    expedited_min_deposit: zCoin.array().optional(),
    expedited_quorum: z.coerce.number().optional(), // only in sei
    // emergency - only in initia
    emergency_min_deposit: zCoin.array().optional(),
    emergency_tally_interval: z.string().optional(),
  })
  .transform<ProposalParams<Coin>>(snakeToCamel);

export const getProposalParams = async (
  endpoint: string
): Promise<ProposalParams<Coin>> =>
  axios
    .get(`${endpoint}/params`)
    .then(({ data }) => zProposalParamsResponse.parse(data));

export const getProposalTypes = async (endpoint: string) =>
  axios
    .get(`${endpoint}/types`)
    .then(({ data }) => zProposalType.array().parse(data));

const zProposal = z.object({
  deposit_end_time: zUtcDate,
  id: z.number().nonnegative(),
  is_expedited: z.boolean(),
  proposer: zBechAddr,
  resolved_height: z.number().nullable(),
  status: zProposalStatus,
  title: z.string(),
  types: zProposalType.array(),
  voting_end_time: zUtcDate.nullable(),
});
const zProposalsResponseItem = zProposal.transform<Proposal>(snakeToCamel);

const zProposalsResponse = z.object({
  items: z.array(zProposalsResponseItem),
  total: z.number().nonnegative(),
});

export type ProposalsResponse = z.infer<typeof zProposalsResponse>;

export const getProposals = async (
  endpoint: string,
  limit: number,
  offset: number,
  proposer: Option<BechAddr20>,
  statuses: ProposalStatus[],
  types: ProposalType[],
  search: string
): Promise<ProposalsResponse> =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        proposer,
        statuses: statuses.join(","),
        types: types.join(","),
        search,
      },
    })
    .then(({ data }) => zProposalsResponse.parse(data));

export const getProposalsByAddress = async (
  endpoint: string,
  address: BechAddr,
  limit: number,
  offset: number
): Promise<ProposalsResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/proposals`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => zProposalsResponse.parse(data));

const zRelatedProposalsResponse = z.object({
  items: z.array(zProposalsResponseItem),
});
export type RelatedProposalsResponse = z.infer<
  typeof zRelatedProposalsResponse
>;

export const getRelatedProposalsByContractAddress = async (
  endpoint: string,
  contractAddress: BechAddr32,
  limit: number,
  offset: number
): Promise<RelatedProposalsResponse> =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(contractAddress)}/related-proposals`,
      {
        params: {
          limit,
          offset,
        },
      }
    )
    .then(({ data }) => zRelatedProposalsResponse.parse(data));

const zProposalDataResponse = z.object({
  info: zProposal
    .extend({
      created_height: z.number().nullable(),
      created_timestamp: zUtcDate.nullable(),
      created_tx_hash: z.string().nullable(),
      description: z.string(),
      messages: z
        .object({
          "@type": z.string(),
        })
        .passthrough()
        .array()
        .nullable(),
      metadata: z.string(),
      proposal_deposits: z
        .object({
          amount: zCoin.array(),
          depositor: zBechAddr,
          timestamp: zUtcDate,
          tx_hash: z.string(),
        })
        .array(),
      resolved_timestamp: zUtcDate.nullable(),
      submit_time: zUtcDate,
      total_deposit: zCoin.array().nullable(),
      version: z.string(),
      voting_time: zUtcDate.nullable(),
    })
    .transform<ProposalData<Coin>>(
      ({ created_tx_hash, proposal_deposits, messages, ...val }) => ({
        ...snakeToCamel(val),
        createdTxHash: created_tx_hash ? parseTxHash(created_tx_hash) : null,
        proposalDeposits: proposal_deposits.map((deposit) => ({
          amount: deposit.amount,
          depositor: deposit.depositor,
          timestamp: deposit.timestamp,
          txHash: parseTxHash(deposit.tx_hash),
        })),
        messages,
      })
    )
    .nullable(),
});
export type ProposalDataResponse = z.infer<typeof zProposalDataResponse>;

export const getProposalData = async (
  endpoint: string,
  id: number
): Promise<ProposalDataResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(id)}/info`)
    .then(({ data }) => zProposalDataResponse.parse(data));

const zProposalVotesInfoResponse = z
  .object({
    yes: z.string(),
    abstain: z.string(),
    no: z.string(),
    no_with_veto: z.string(),
    total_voting_power: z.string(),
  })
  .transform<ProposalVotesInfo>((val) => ({
    yes: big(val.yes),
    abstain: big(val.abstain),
    no: big(val.no),
    noWithVeto: big(val.no_with_veto),
    totalVotingPower: big(val.total_voting_power),
  }));

export const getProposalVotesInfo = async (
  endpoint: string,
  id: number
): Promise<ProposalVotesInfo> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(id)}/votes-info`)
    .then(({ data }) => zProposalVotesInfoResponse.parse(data));

const zProposalVotesResponseItem = z
  .object({
    proposal_id: z.number().nonnegative(),
    abstain: z.number().nonnegative(),
    no: z.number().nonnegative(),
    no_with_veto: z.number().nonnegative(),
    yes: z.number().nonnegative(),
    is_vote_weighted: z.boolean(),
    validator: zValidator,
    voter: zBechAddr.nullable(),
    timestamp: zUtcDate.nullable(),
    tx_hash: z.string().nullable(),
  })
  .transform<ProposalVote>(snakeToCamel);

const zProposalVotesResponse = z.object({
  items: z.array(zProposalVotesResponseItem),
  total: z.number().nonnegative(),
});
export type ProposalVotesResponse = z.infer<typeof zProposalVotesResponse>;

export const getProposalValidatorVotes = async (
  endpoint: string,
  id: number
): Promise<ProposalVotesResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(id)}/validator-votes`)
    .then(({ data }) => zProposalVotesResponse.parse(data));
