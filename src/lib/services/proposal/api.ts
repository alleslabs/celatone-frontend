import type {
  ProposalAnswerCountsResponse,
  ProposalDataResponse,
  ProposalsResponse,
  ProposalValidatorVotesResponse,
  ProposalVotesResponse,
  RelatedProposalsResponse,
} from "lib/services/types";
import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  Coin,
  Option,
  ProposalParams,
  ProposalStatus,
  ProposalType,
  ProposalValidatorVote,
  ProposalVotesInfo,
  ProposalVoteType,
} from "lib/types";

import axios from "axios";
import {
  zProposalAnswerCountsResponse,
  zProposalDataResponse,
  zProposalParamsResponse,
  zProposalsResponse,
  zProposalVotesInfoResponse,
  zProposalVotesResponse,
  zRelatedProposalsResponse,
} from "lib/services/types";
import { zProposalType } from "lib/types";
import { parseWithError } from "lib/utils";

export const getProposalParams = async (
  endpoint: string
): Promise<ProposalParams<Coin>> =>
  axios
    .get(`${endpoint}/params`)
    .then(({ data }) => parseWithError(zProposalParamsResponse, data));

export const getProposalTypes = async (endpoint: string) =>
  axios
    .get(`${endpoint}/types`)
    .then(({ data }) => parseWithError(zProposalType.array(), data));

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
    .then(({ data }) => parseWithError(zProposalsResponse, data));

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
    .then(({ data }) => parseWithError(zProposalsResponse, data));

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
    .then(({ data }) => parseWithError(zRelatedProposalsResponse, data));

export const getProposalData = async (
  endpoint: string,
  id: number
): Promise<ProposalDataResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(id)}/info`)
    .then(({ data }) => parseWithError(zProposalDataResponse, data));

export const getProposalVotesInfo = async (
  endpoint: string,
  id: number
): Promise<ProposalVotesInfo> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(id)}/votes-info`)
    .then(({ data }) => parseWithError(zProposalVotesInfoResponse, data));

export const getProposalVotes = async (
  endpoint: string,
  id: number,
  limit: number,
  offset: number,
  answer: ProposalVoteType,
  search: string
): Promise<ProposalVotesResponse> => {
  let url = `${endpoint}/${encodeURIComponent(id)}/votes?limit=${limit}&offset=${offset}`;
  url = url.concat(search ? `&search=${encodeURIComponent(search)}` : "");
  url = url.concat(answer ? `&answer=${encodeURIComponent(answer)}` : "");

  return axios
    .get(url)
    .then(({ data }) => parseWithError(zProposalVotesResponse, data));
};

export const getProposalValidatorVotes = async (
  endpoint: string,
  id: number,
  limit: number,
  offset: number,
  answer: ProposalVoteType,
  search: string
): Promise<ProposalValidatorVotesResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(id)}/validator-votes`, {
      params: {
        limit,
        offset,
        answer,
        search,
      },
    })
    .then(({ data }) => {
      const parsed = parseWithError(zProposalVotesResponse, data);
      return {
        items: parsed.items.map<ProposalValidatorVote>((item, idx) => ({
          ...item,
          rank: offset + idx + 1,
        })),
        total: parsed.total,
      };
    });

export const getProposalAnswerCounts = async (
  endpoint: string,
  id: number
): Promise<ProposalAnswerCountsResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(id)}/answer-counts`)
    .then(({ data }) => parseWithError(zProposalAnswerCountsResponse, data));
