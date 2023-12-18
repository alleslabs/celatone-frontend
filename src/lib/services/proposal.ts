import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import { z } from "zod";

import {
  type AccessConfigPermission,
  type Addr,
  type SnakeToCamelCaseNested,
  type Proposal,
  type ProposalType,
  zAddr,
  zUtcDate,
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
  address: Addr;
  addresses?: Addr[];
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
    proposer: zAddr,
    resolved_height: z.number().nullish(),
    status: z.string().transform(parseProposalStatus),
    title: z.string(),
    type: z.string(),
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
    type: val.type as ProposalType, // TODO: remove type assertion
    votingEndTime: val.voting_end_time,
  }));

const zProposalResponse = z.object({
  items: z.array(zProposalsResponseItem),
  total: z.number().nonnegative(),
});

export type ProposalResponse = z.infer<typeof zProposalResponse>;

export const getProposalsByAddress = async (
  endpoint: string,
  address: Addr,
  limit: number,
  offset: number
): Promise<ProposalResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/proposals`, {
      params: {
        limit,
        offset,
      },
    })
    .then((res) => zProposalResponse.parse(res.data));
