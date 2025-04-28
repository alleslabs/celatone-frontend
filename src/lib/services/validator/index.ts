import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type {
  Nullable,
  Option,
  ProposalVoteType,
  Validator,
  ValidatorAddr,
  ValidatorData,
} from "lib/types";

import { useToken } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useInitia,
  useTierConfig,
} from "lib/app-provider";
import { createQueryFnWithTimeout } from "lib/services/utils";
import { convertConsensusPubkeyToConsensusAddr } from "lib/utils";

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
  getHistoricalPowers,
  getValidatorData,
  getValidatorDelegationRelatedTxs,
  getValidatorProposedBlocks,
  getValidators,
  getValidatorStakingProvisions,
  getValidatorUptime,
  getValidatorVotedProposals,
  getValidatorVotedProposalsAnswerCounts,
} from "./api";
import {
  getValidatorDataRest,
  getValidatorDelegatorsRest,
  getValidatorsRest,
  getValidatorStakingProvisionsRest,
} from "./rest";
import { resolveValIdentity } from "./utils";

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
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
};

export const useValidatorsRest = (enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  return useQuery<ValidatorData[]>(
    [CELATONE_QUERY_KEYS.VALIDATORS_REST, restEndpoint],
    async () => {
      const res = await getValidatorsRest(restEndpoint);
      return res.map((val) => ({
        ...val,
        consensusAddress: convertConsensusPubkeyToConsensusAddr(
          val.consensusPubkey,
          bech32Prefix
        ),
      }));
    },
    {
      enabled,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: 1,
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
      enabled,
      retry: 1,
    }
  );
};

export const useValidatorDataRest = (
  validatorAddr: ValidatorAddr,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  return useQuery<ValidatorData>(
    [CELATONE_QUERY_KEYS.VALIDATOR_DATA_REST, restEndpoint, validatorAddr],
    async () => {
      const res = await getValidatorDataRest(restEndpoint, validatorAddr);
      return {
        ...res,
        consensusAddress: convertConsensusPubkeyToConsensusAddr(
          res.consensusPubkey,
          bech32Prefix
        ),
      };
    },
    {
      enabled: enabled && Boolean(validatorAddr),
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useValidatorStakingProvisions = (enabled: boolean) => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("validators");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const endpoint = isFullTier ? apiEndpoint : restEndpoint;

  const {
    chainConfig: { chain },
  } = useCelatoneApp();

  return useQuery<StakingProvisionsResponse>(
    [CELATONE_QUERY_KEYS.VALIDATOR_STAKING_PROVISIONS, endpoint, chain],
    async () =>
      isFullTier
        ? getValidatorStakingProvisions(endpoint)
        : getValidatorStakingProvisionsRest(endpoint, chain),
    {
      enabled,
      retry: 1,
    }
  );
};

export const useValidatorDelegators = (validatorAddress: ValidatorAddr) => {
  const isInitia = useInitia();
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const queryFn = async () =>
    getValidatorDelegatorsRest(restEndpoint, validatorAddress, isInitia);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.VALIDATOR_DELEGATORS,
      restEndpoint,
      validatorAddress,
      isInitia,
    ],
    createQueryFnWithTimeout(queryFn, 10000),
    // TODO: Remove this once we have a way to get the delegators count in initia
    { enabled: !isInitia, retry: false }
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
      refetchOnWindowFocus: false,
      retry: 1,
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
    [CELATONE_QUERY_KEYS.VALIDATOR_HISTORICAL_POWERS, endpoint, validatorAddr],
    async () => getHistoricalPowers(endpoint, validatorAddr),
    {
      refetchOnWindowFocus: false,
      retry: 1,
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
  const { chainName } = useCurrentChain();
  const [primaryDark] = useToken("colors", ["primary.dark"]);

  return useQuery({
    enabled: Boolean(validator),
    queryFn: async () => {
      if (!validator) return "";
      return resolveValIdentity(chainName, validator, primaryDark);
    },
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      CELATONE_QUERY_KEYS.VALIDATOR_IDENTITY,
      chainName,
      validator?.validatorAddress,
      validator?.identity,
      validator?.moniker,
      primaryDark,
    ],
    refetchOnWindowFocus: false,
    retry: false,
  });
};
