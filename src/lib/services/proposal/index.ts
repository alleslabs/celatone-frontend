import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  Coin,
  Option,
  ProposalDeposit,
  ProposalParams,
  ProposalStatus,
  ProposalType,
  ProposalVotesInfo,
  ProposalVoteType,
} from "lib/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useTierConfig,
} from "lib/app-provider";

import type {
  ProposalAnswerCountsResponse,
  ProposalDataResponse,
  ProposalDataResponseRest,
  ProposalsResponse,
  ProposalsResponseRest,
  ProposalValidatorVotesResponse,
  ProposalVotesResponse,
  RelatedProposalsResponse,
} from "../types";

import {
  getProposalAnswerCounts,
  getProposalData,
  getProposalParams,
  getProposals,
  getProposalsByAddress,
  getProposalTypes,
  getProposalValidatorVotes,
  getProposalVotes,
  getProposalVotesInfo,
  getRelatedProposalsByContractAddress,
} from "./api";
import {
  getProposalDataRest,
  getProposalDepositsRest,
  getProposalParamsRest,
  getProposalsRest,
  getProposalVotesInfoRest,
} from "./rest";

export const useProposalParams = () => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("proposals");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const [endpoint, queryFn] = isFullTier
    ? [apiEndpoint, getProposalParams]
    : [restEndpoint, getProposalParamsRest];

  return useQuery<ProposalParams<Coin>>(
    [CELATONE_QUERY_KEYS.PROPOSAL_PARAMS, endpoint],
    async () => queryFn(endpoint),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useProposalTypes = () => {
  const endpoint = useBaseApiRoute("proposals");
  return useQuery<ProposalType[]>(
    [CELATONE_QUERY_KEYS.PROPOSAL_TYPES, endpoint],
    async () => getProposalTypes(endpoint),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useProposals = (
  limit: number,
  offset: number,
  proposer: Option<BechAddr20>,
  statuses: ProposalStatus[],
  types: ProposalType[],
  search: string
) => {
  const endpoint = useBaseApiRoute("proposals");
  const trimmedSearch = search.trim();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSALS,
      endpoint,
      limit,
      offset,
      proposer,
      statuses,
      types,
      trimmedSearch,
    ],
    async () =>
      getProposals(
        endpoint,
        limit,
        offset,
        proposer,
        statuses,
        types,
        trimmedSearch
      ),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useProposalsRest = (
  status?: Omit<ProposalStatus, "DEPOSIT_FAILED" | "CANCELLED">
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const { data, ...rest } = useInfiniteQuery<ProposalsResponseRest>(
    [CELATONE_QUERY_KEYS.PROPOSALS_REST, restEndpoint, status],
    ({ pageParam }) => getProposalsRest(restEndpoint, pageParam, status),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: data?.pages.flatMap((page) => page.proposals),
    ...rest,
  };
};

export const useProposalsByAddress = (
  address: BechAddr,
  offset: number,
  limit: number
): UseQueryResult<ProposalsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSALS_BY_ADDRESS,
      endpoint,
      address,
      limit,
      offset,
    ],
    async () => getProposalsByAddress(endpoint, address, limit, offset),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useRelatedProposalsByContractAddress = (
  contractAddress: BechAddr32,
  offset: number,
  limit: number
) => {
  const endpoint = useBaseApiRoute("contracts");

  return useQuery<RelatedProposalsResponse>(
    [
      CELATONE_QUERY_KEYS.RELATED_PROPOSALS_BY_CONTRACT_ADDRESS,
      endpoint,
      contractAddress,
      limit,
      offset,
    ],
    async () =>
      getRelatedProposalsByContractAddress(
        endpoint,
        contractAddress,
        limit,
        offset
      ),
    {
      retry: 1,
      keepPreviousData: true,
    }
  );
};

export const useProposalData = (id: number, enabled = true) => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery<ProposalDataResponse>(
    [CELATONE_QUERY_KEYS.PROPOSAL_DATA, endpoint, id],
    async () => getProposalData(endpoint, id),
    { retry: 1, enabled }
  );
};

export const useProposalDataRest = (id: number, enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<ProposalDataResponseRest>(
    [CELATONE_QUERY_KEYS.PROPOSAL_DATA_REST, restEndpoint, id],
    async () => getProposalDataRest(restEndpoint, id),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useProposalDepositsRest = (id: number, enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<ProposalDeposit<Coin>[]>(
    [CELATONE_QUERY_KEYS.PROPOSAL_DEPOSITS_REST, restEndpoint, id],
    async () => getProposalDepositsRest(restEndpoint, id),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useProposalVotesInfo = (id: number, enabled: boolean) => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("proposals");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const [endpoint, queryFn] = isFullTier
    ? [apiEndpoint, getProposalVotesInfo]
    : [restEndpoint, getProposalVotesInfoRest];

  return useQuery<ProposalVotesInfo>(
    [CELATONE_QUERY_KEYS.PROPOSAL_VOTES_INFO, endpoint, id],
    async () => queryFn(endpoint, id),
    { retry: 1, refetchOnWindowFocus: false, enabled }
  );
};

export const useProposalVotes = (
  id: number,
  limit: number,
  offset: number,
  answer: ProposalVoteType,
  search: string,
  options: Pick<UseQueryOptions<ProposalVotesResponse>, "onSuccess"> = {}
): UseQueryResult<ProposalVotesResponse> => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSAL_VOTES,
      endpoint,
      id,
      limit,
      offset,
      search,
      answer,
    ],
    async () => getProposalVotes(endpoint, id, limit, offset, answer, search),
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useProposalValidatorVotes = (
  id: number,
  limit: number,
  offset: number,
  answer: ProposalVoteType,
  search: string,
  options: Pick<
    UseQueryOptions<ProposalValidatorVotesResponse>,
    "onSuccess"
  > = {}
) => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSAL_VALIDATOR_VOTES,
      endpoint,
      id,
      limit,
      offset,
      answer,
      search,
    ],
    async () =>
      getProposalValidatorVotes(endpoint, id, limit, offset, answer, search),
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useProposalAnswerCounts = (
  id: number,
  enabled: boolean
): UseQueryResult<ProposalAnswerCountsResponse> => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery(
    [CELATONE_QUERY_KEYS.PROPOSAL_ANSWER_COUNTS, endpoint, id],
    async () => getProposalAnswerCounts(endpoint, id),
    { retry: 1, refetchOnWindowFocus: false, enabled }
  );
};
