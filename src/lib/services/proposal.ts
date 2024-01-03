import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import { z } from "zod";

import { zUtcDate, zProposalType, zBechAddr } from "lib/types";
import type {
  AccessConfigPermission,
  BechAddr,
  BechAddr32,
  SnakeToCamelCaseNested,
  Proposal,
} from "lib/types";
import { parseProposalStatus, snakeToCamel } from "lib/utils";

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
    .get<{ deposit_params: DepositParams }>(
      `${lcdEndpoint}/cosmos/gov/v1beta1/params/deposit`
    )
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
    .get<{ voting_params: VotingParams }>(
      `${lcdEndpoint}/cosmos/gov/v1beta1/params/voting`
    )
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

const zProposalsResponseItem = z
  .object({
    deposit_end_time: zUtcDate,
    id: z.number().nonnegative(),
    is_expedited: z.boolean(),
    proposer: zBechAddr,
    resolved_height: z.number().nullish(),
    status: z.string().transform(parseProposalStatus),
    title: z.string(),
    type: zProposalType,
    voting_end_time: zUtcDate,
  })
  .transform<Proposal>((val) => ({
    depositEndTime: val.deposit_end_time,
    proposalId: val.id,
    isExpedited: val.is_expedited,
    proposer: val.proposer,
    resolvedHeight: val.resolved_height,
    status: val.status,
    title: val.title,
    type: val.type,
    votingEndTime: val.voting_end_time,
  }));

const zProposalsResponse = z.object({
  items: z.array(zProposalsResponseItem),
  total: z.number().nonnegative(),
});

export type ProposalsResponse = z.infer<typeof zProposalsResponse>;

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

const zRelatedProposalsResponseItem = z
  .object({
    deposit_end_time: zUtcDate,
    proposal_id: z.number().nonnegative(),
    is_expedited: z.boolean(),
    proposer: zBechAddr,
    resolved_height: z.number().nullish(),
    status: z.string().transform(parseProposalStatus),
    title: z.string(),
    type: zProposalType,
    voting_end_time: zUtcDate,
  })
  .transform<Proposal>((val) => ({
    depositEndTime: val.deposit_end_time,
    proposalId: val.proposal_id,
    isExpedited: val.is_expedited,
    proposer: val.proposer,
    resolvedHeight: val.resolved_height,
    status: val.status,
    title: val.title,
    type: val.type,
    votingEndTime: val.voting_end_time,
  }));

const zRelatedProposalsResponse = z.object({
  items: z.array(zRelatedProposalsResponseItem),
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
