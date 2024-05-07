import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import type {
  BlocksResponse,
  StakingProvisionsResponse,
  ValidatorDataResponse,
  ValidatorDelegationRelatedTxsResponse,
  ValidatorsResponse,
  ValidatorUptimeResponse,
  ValidatorVotedProposalsResponse,
} from "../types";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
  useLcdEndpoint,
} from "lib/app-provider";
import { createQueryFnWithTimeout } from "lib/query-utils";
import type {
  Nullable,
  Option,
  ProposalVoteType,
  Validator,
  ValidatorAddr,
  ValidatorData,
} from "lib/types";

import {
  getHistoricalPowers,
  getValidatorData,
  getValidatorDelegationRelatedTxs,
  getValidatorDelegators,
  getValidatorProposedBlocks,
  getValidators,
  getValidatorStakingProvisions,
  getValidatorUptime,
  getValidatorVotedProposals,
  getValidatorVotedProposalsAnswerCounts,
} from "./api";
import { getValidatorDataLcd, getValidatorsLcd } from "./lcd";
import { resolveValIdentity } from "./misc";

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

export const useValidatorsLcd = () => {
  const endpoint = useLcdEndpoint();

  return useQuery<ValidatorData[]>(
    [CELATONE_QUERY_KEYS.VALIDATORS_LCD, endpoint],
    async () => getValidatorsLcd(endpoint),
    {
      retry: 1,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );
};

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

export const useValidatorDataLcd = (
  validatorAddr: ValidatorAddr,
  enabled = true
) => {
  const endpoint = useLcdEndpoint();

  return useQuery<ValidatorData>(
    [
      CELATONE_QUERY_KEYS.VALIDATOR_DATA_LCD,
      endpoint,
      validatorAddr,
    ] as string[],
    async () => getValidatorDataLcd(endpoint, validatorAddr),
    {
      enabled: enabled && Boolean(validatorAddr),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

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

export const useValidatorImage = (
  validator: Nullable<Validator>
): UseQueryResult<string> => {
  const {
    chain: { chain_name: chainName },
  } = useCurrentChain();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.VALIDATOR_IDENTITY,
      chainName,
      validator?.validatorAddress,
      validator?.identity,
      validator?.moniker,
    ],
    queryFn: async () => {
      if (!validator) return Promise.resolve("");
      return resolveValIdentity(chainName, validator);
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(validator),
  });
};