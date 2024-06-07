import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type {
  ProposalAnswerCountsResponse,
  ProposalDataResponse,
  ProposalDataResponseLcd,
  ProposalsResponse,
  ProposalsResponseLcd,
  ProposalValidatorVotesResponse,
  ProposalVotesResponse,
  RelatedProposalsResponse,
} from "../types/proposal";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useLcdEndpoint,
  useTierConfig,
} from "lib/app-provider";
import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  Coin,
  Option,
  ProposalParams,
  ProposalStatus,
  ProposalType,
  ProposalVotesInfo,
  ProposalVoteType,
} from "lib/types";

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
  getProposalDataLcd,
  getProposalParamsLcd,
  getProposalsLcd,
} from "./lcd";

export const useProposalParams = () => {
  const tier = useTierConfig();
  const endpointApi = useBaseApiRoute("proposals");
  const endpointLcd = useLcdEndpoint();

  const [endpoint, queryFn] =
    tier === "full"
      ? [endpointApi, getProposalParams]
      : [endpointLcd, getProposalParamsLcd];

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

export const useProposalsLcd = (
  status?: Omit<ProposalStatus, "DEPOSIT_FAILED" | "CANCELLED">
) => {
  const lcdEndpoint = useLcdEndpoint();

  const query = useInfiniteQuery<ProposalsResponseLcd>(
    [CELATONE_QUERY_KEYS.PROPOSALS_LCD, lcdEndpoint, status],
    ({ pageParam }) => getProposalsLcd(lcdEndpoint, pageParam, status),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );

  const { data, ...rest } = query;

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

export const useProposalDataLcd = (id: string, enabled = true) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<ProposalDataResponseLcd>(
    [CELATONE_QUERY_KEYS.PROPOSAL_DATA_LCD, lcdEndpoint, id],
    async () => getProposalDataLcd(lcdEndpoint, id),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useProposalVotesInfo = (id: number) => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery<ProposalVotesInfo>(
    [CELATONE_QUERY_KEYS.PROPOSAL_VOTES_INFO, endpoint, id],
    async () => getProposalVotesInfo(endpoint, id),
    { retry: 1, refetchOnWindowFocus: false }
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
  validatorOnly = false
): UseQueryResult<ProposalAnswerCountsResponse> => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery(
    [CELATONE_QUERY_KEYS.PROPOSAL_ANSWER_COUNTS, endpoint, id, validatorOnly],
    async () => getProposalAnswerCounts(endpoint, id),
    { retry: 1, refetchOnWindowFocus: false }
  );
};
