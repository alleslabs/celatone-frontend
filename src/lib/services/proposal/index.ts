import type { UseQueryResult } from "@tanstack/react-query";
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

import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useInitia,
  useTierConfig,
} from "lib/app-provider";

import type {
  ProposalAnswerCountsResponse,
  ProposalDataResponse,
  ProposalDataResponseRest,
  ProposalsResponse,
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

  return useQuery<ProposalParams<Coin>>({
    queryKey: [CELATONE_QUERY_KEYS.PROPOSAL_PARAMS, endpoint],
    queryFn: async () => queryFn(endpoint),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useProposalTypes = () => {
  const endpoint = useBaseApiRoute("proposals");
  return useQuery<ProposalType[]>({
    queryKey: [CELATONE_QUERY_KEYS.PROPOSAL_TYPES, endpoint],
    queryFn: async () => getProposalTypes(endpoint),
    refetchOnWindowFocus: false,
    retry: 1,
  });
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

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.PROPOSALS,
      endpoint,
      limit,
      offset,
      proposer,
      statuses,
      types,
      trimmedSearch,
    ],
    queryFn: async () =>
      getProposals(
        endpoint,
        limit,
        offset,
        proposer,
        statuses,
        types,
        trimmedSearch
      ),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useProposalsRest = (
  status?: Omit<ProposalStatus, "CANCELLED" | "DEPOSIT_FAILED">
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const isInitia = useInitia();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.PROPOSALS_REST,
      restEndpoint,
      status,
      isInitia,
    ],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getProposalsRest(isInitia, restEndpoint, pageParam, status),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
  });

  return {
    data: data?.pages.flatMap((page) => page.proposals),
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};

export const useProposalsByAddress = (
  address: BechAddr,
  offset: number,
  limit: number
): UseQueryResult<ProposalsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.PROPOSALS_BY_ADDRESS,
      endpoint,
      address,
      limit,
      offset,
    ],
    queryFn: async () =>
      getProposalsByAddress(endpoint, address, limit, offset),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useRelatedProposalsByContractAddress = (
  contractAddress: BechAddr32,
  offset: number,
  limit: number
) => {
  const endpoint = useBaseApiRoute("contracts");

  return useQuery<RelatedProposalsResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () =>
      getRelatedProposalsByContractAddress(
        endpoint,
        contractAddress,
        limit,
        offset
      ),
    queryKey: [
      CELATONE_QUERY_KEYS.RELATED_PROPOSALS_BY_CONTRACT_ADDRESS,
      endpoint,
      contractAddress,
      limit,
      offset,
    ],
    retry: 1,
  });
};

export const useProposalData = (id: number, enabled = true) => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery<ProposalDataResponse>({
    enabled,
    queryFn: async () => getProposalData(endpoint, id),
    queryKey: [CELATONE_QUERY_KEYS.PROPOSAL_DATA, endpoint, id],
    retry: 1,
  });
};

export const useProposalDataRest = (id: number, enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const isInitia = useInitia();

  return useQuery<ProposalDataResponseRest>({
    enabled,
    queryFn: async () => getProposalDataRest(isInitia, restEndpoint, id),
    queryKey: [
      CELATONE_QUERY_KEYS.PROPOSAL_DATA_REST,
      restEndpoint,
      id,
      isInitia,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useProposalDepositsRest = (id: number, enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<ProposalDeposit<Coin>[]>({
    enabled,
    queryFn: async () => getProposalDepositsRest(restEndpoint, id),
    queryKey: [CELATONE_QUERY_KEYS.PROPOSAL_DEPOSITS_REST, restEndpoint, id],
    refetchOnWindowFocus: false,
    retry: 1,
  });
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

  return useQuery<ProposalVotesInfo>({
    enabled,
    queryFn: async () => queryFn(endpoint, id),
    queryKey: [CELATONE_QUERY_KEYS.PROPOSAL_VOTES_INFO, endpoint, id],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useProposalVotes = (
  id: number,
  limit: number,
  offset: number,
  answer: ProposalVoteType,
  search: string
): UseQueryResult<ProposalVotesResponse> => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.PROPOSAL_VOTES,
      endpoint,
      id,
      limit,
      offset,
      search,
      answer,
    ],
    queryFn: async () =>
      getProposalVotes(endpoint, id, limit, offset, answer, search),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useProposalValidatorVotes = (
  id: number,
  limit: number,
  offset: number,
  answer: ProposalVoteType,
  search: string
): UseQueryResult<ProposalValidatorVotesResponse> => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.PROPOSAL_VALIDATOR_VOTES,
      endpoint,
      id,
      limit,
      offset,
      answer,
      search,
    ],
    queryFn: async () =>
      getProposalValidatorVotes(endpoint, id, limit, offset, answer, search),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useProposalAnswerCounts = (
  id: number,
  enabled: boolean
): UseQueryResult<ProposalAnswerCountsResponse> => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery({
    queryKey: [CELATONE_QUERY_KEYS.PROPOSAL_ANSWER_COUNTS, endpoint, id],
    queryFn: async () => getProposalAnswerCounts(endpoint, id),
    enabled,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
