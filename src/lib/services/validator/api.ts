import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import { createQueryFnWithTimeout } from "lib/query-utils";
import type {
  BlocksResponse,
  HistoricalPowersResponse,
  StakingProvisionsResponse,
  ValidatorDataResponse,
  ValidatorDelegationRelatedTxsResponse,
  ValidatorsResponse,
  ValidatorUptimeResponse,
  ValidatorVotedProposalsResponse,
} from "lib/services/types";
import {
  zBlocksResponse,
  zHistoricalPowersResponse,
  zStakingProvisionsResponse,
  zValidatorDataResponse,
  zValidatorDelegationRelatedTxsResponse,
  zValidatorDelegatorsResponse,
  zValidatorsResponse,
  zValidatorUptimeResponse,
  zValidatorVotedProposalsResponse,
  zValidatorVotedProposalsResponseAnswerCounts,
} from "lib/services/types";
import type { Option, ProposalVoteType, ValidatorAddr } from "lib/types";
import { parseWithError } from "lib/utils";

const getValidators = async (
  endpoint: string,
  limit: number,
  offset: number,
  isActive: boolean,
  sortBy: string,
  isDesc: boolean,
  search: Option<string>
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        is_active: isActive,
        sort_by: sortBy,
        is_desc: isDesc,
        search,
      },
    })
    .then(({ data }) => parseWithError(zValidatorsResponse, data));

export const useValidators = (
  limit: number,
  offset: number,
  isActive: boolean,
  sortBy: string,
  isDesc: boolean,
  search: Option<string>,
  options?: Pick<UseQueryOptions<ValidatorsResponse>, "onSuccess">
) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery<ValidatorsResponse>(
    [
      CELATONE_QUERY_KEYS.VALIDATORS,
      endpoint,
      limit,
      offset,
      isActive,
      sortBy,
      isDesc,
      search,
    ],
    async () =>
      getValidators(endpoint, limit, offset, isActive, sortBy, isDesc, search),
    {
      retry: 1,
      keepPreviousData: true,
      ...options,
    }
  );
};

const getValidatorData = async (
  endpoint: string,
  validatorAddress: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(validatorAddress)}/info`)
    .then(({ data }) => parseWithError(zValidatorDataResponse, data));

export const useValidatorData = (
  validatorAddress: ValidatorAddr,
  enabled = true
) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery<ValidatorDataResponse>(
    [CELATONE_QUERY_KEYS.VALIDATOR_DATA, endpoint, validatorAddress],
    async () => getValidatorData(endpoint, validatorAddress),
    {
      retry: 1,
      enabled,
    }
  );
};

const getValidatorStakingProvisions = async (endpoint: string) =>
  axios
    .get(`${endpoint}/staking-provisions`)
    .then(({ data }) => parseWithError(zStakingProvisionsResponse, data));

export const useValidatorStakingProvisions = (enabled: boolean) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery<StakingProvisionsResponse>(
    [CELATONE_QUERY_KEYS.VALIDATOR_STAKING_PROVISIONS, endpoint],
    async () => getValidatorStakingProvisions(endpoint),
    {
      enabled,
      retry: 1,
    }
  );
};

const getValidatorDelegators = async (
  endpoint: string,
  validatorAddress: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(validatorAddress)}/delegators`)
    .then(({ data }) => parseWithError(zValidatorDelegatorsResponse, data));

export const useValidatorDelegators = (validatorAddress: ValidatorAddr) => {
  const endpoint = useBaseApiRoute("validators");

  const queryFn = async () =>
    getValidatorDelegators(endpoint, validatorAddress);

  return useQuery(
    [CELATONE_QUERY_KEYS.VALIDATOR_DELEGATORS, endpoint, validatorAddress],
    createQueryFnWithTimeout(queryFn, 10000),
    { retry: false }
  );
};

const getValidatorVotedProposalsAnswerCounts = async (
  endpoint: string,
  validatorAddress: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(validatorAddress)}/answer-counts`)
    .then(({ data }) =>
      parseWithError(zValidatorVotedProposalsResponseAnswerCounts, data)
    );

export const useValidatorVotedProposalsAnswerCounts = (
  validatorAddress: ValidatorAddr
) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.VALIDATOR_VOTED_PROPOSALS_ANSWER_COUNTS,
      endpoint,
      validatorAddress,
    ],
    async () =>
      getValidatorVotedProposalsAnswerCounts(endpoint, validatorAddress),
    { retry: 1 }
  );
};

const getValidatorVotedProposals = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number,
  answer?: string,
  search?: string
) =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(validatorAddress)}/voted-proposals`,
      {
        params: {
          limit,
          offset,
          answer,
          search,
        },
      }
    )
    .then(({ data }) => parseWithError(zValidatorVotedProposalsResponse, data));

export const useValidatorVotedProposals = (
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number,
  answer: ProposalVoteType,
  search: string,
  options: Pick<
    UseQueryOptions<ValidatorVotedProposalsResponse>,
    "onSuccess"
  > = {}
) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.VALIDATOR_VOTED_PROPOSALS,
      endpoint,
      validatorAddress,
      limit,
      offset,
      answer,
      search,
    ],
    async () =>
      getValidatorVotedProposals(
        endpoint,
        validatorAddress,
        limit,
        offset,
        answer,
        search
      ),
    { retry: 1, ...options }
  );
};

const getValidatorUptime = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  blocks: number
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(validatorAddress)}/uptime`, {
      params: {
        blocks,
      },
    })
    .then(({ data }) => parseWithError(zValidatorUptimeResponse, data));

export const useValidatorUptime = (
  validatorAddress: ValidatorAddr,
  blocks: number
) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery<ValidatorUptimeResponse>(
    [CELATONE_QUERY_KEYS.VALIDATOR_UPTIME, endpoint, validatorAddress, blocks],
    async () => getValidatorUptime(endpoint, validatorAddress, blocks),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

const getValidatorProposedBlocks = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(validatorAddress)}/proposed-blocks`,
      {
        params: {
          limit,
          offset,
        },
      }
    )
    .then(({ data }) => parseWithError(zBlocksResponse, data));

export const useValidatorProposedBlocks = (
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<BlocksResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery<BlocksResponse>(
    [
      CELATONE_QUERY_KEYS.VALIDATOR_PROPOSED_BLOCKS,
      endpoint,
      validatorAddress,
      limit,
      offset,
    ],
    async () =>
      getValidatorProposedBlocks(endpoint, validatorAddress, limit, offset),
    { retry: 1, ...options }
  );
};

const getHistoricalPowers = async (
  endpoint: string,
  validatorAddr: ValidatorAddr
): Promise<HistoricalPowersResponse> =>
  axios
    .get(`${endpoint}/${validatorAddr}/historical-powers`)
    .then(({ data }) => parseWithError(zHistoricalPowersResponse, data));

export const useValidatorHistoricalPowers = (validatorAddr: ValidatorAddr) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery(
    [CELATONE_QUERY_KEYS.VALIDATOR_HISTORICAL_POWERS, endpoint],
    async () => getHistoricalPowers(endpoint, validatorAddr),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

const getValidatorDelegationRelatedTxs = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(validatorAddress)}/delegation-related-txs`,
      {
        params: {
          limit,
          offset,
        },
      }
    )
    .then(({ data }) =>
      parseWithError(zValidatorDelegationRelatedTxsResponse, data)
    );

export const useValidatorDelegationRelatedTxs = (
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number,
  options: Pick<
    UseQueryOptions<ValidatorDelegationRelatedTxsResponse>,
    "onSuccess"
  > = {}
) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery<ValidatorDelegationRelatedTxsResponse>(
    [
      CELATONE_QUERY_KEYS.VALIDATOR_DELEGATION_RELATED_TXS,
      endpoint,
      validatorAddress,
      limit,
      offset,
    ],
    async () =>
      getValidatorDelegationRelatedTxs(
        endpoint,
        validatorAddress,
        limit,
        offset
      ),
    { retry: 1, ...options }
  );
};
