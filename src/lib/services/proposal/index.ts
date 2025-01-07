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
  ProposalDeposit,
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
  getProposalDepositsLcd,
  getProposalParamsLcd,
  getProposalsLcd,
  getProposalVotesInfoLcd,
} from "./lcd";

export const useProposalParams = () => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("proposals");
  const lcdEndpoint = useLcdEndpoint();

  const [endpoint, queryFn] = isFullTier
    ? [apiEndpoint, getProposalParams]
    : [lcdEndpoint, getProposalParamsLcd];

  return useQuery<ProposalParams<Coin>>(
    [CELATONE_QUERY_KEYS.PROPOSAL_PARAMS, endpoint],
    async () => queryFn(endpoint),
    { refetchOnWindowFocus: false, retry: 1 }
  );
};

export const useProposalTypes = () => {
  const endpoint = useBaseApiRoute("proposals");
  return useQuery<ProposalType[]>(
    [CELATONE_QUERY_KEYS.PROPOSAL_TYPES, endpoint],
    async () => getProposalTypes(endpoint),
    { refetchOnWindowFocus: false, retry: 1 }
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
    { refetchOnWindowFocus: false, retry: 1 }
  );
};

export const useProposalsLcd = (
  status?: Omit<ProposalStatus, "CANCELLED" | "DEPOSIT_FAILED">
) => {
  const lcdEndpoint = useLcdEndpoint();

  const { data, ...rest } = useInfiniteQuery<ProposalsResponseLcd>(
    [CELATONE_QUERY_KEYS.PROPOSALS_LCD, lcdEndpoint, status],
    ({ pageParam }) => getProposalsLcd(lcdEndpoint, pageParam, status),
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
    { refetchOnWindowFocus: false, retry: 1 }
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
      keepPreviousData: true,
      retry: 1,
    }
  );
};

export const useProposalData = (id: number, enabled = true) => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery<ProposalDataResponse>(
    [CELATONE_QUERY_KEYS.PROPOSAL_DATA, endpoint, id],
    async () => getProposalData(endpoint, id),
    { enabled, retry: 1 }
  );
};

export const useProposalDataLcd = (id: number, enabled = true) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<ProposalDataResponseLcd>(
    [CELATONE_QUERY_KEYS.PROPOSAL_DATA_LCD, lcdEndpoint, id],
    async () => getProposalDataLcd(lcdEndpoint, id),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useProposalDepositsLcd = (id: number, enabled = true) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<ProposalDeposit<Coin>[]>(
    [CELATONE_QUERY_KEYS.PROPOSAL_DEPOSITS_LCD, lcdEndpoint, id],
    async () => getProposalDepositsLcd(lcdEndpoint, id),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useProposalVotesInfo = (id: number, enabled: boolean) => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("proposals");
  const lcdEndpoint = useLcdEndpoint();

  const [endpoint, queryFn] = isFullTier
    ? [apiEndpoint, getProposalVotesInfo]
    : [lcdEndpoint, getProposalVotesInfoLcd];

  return useQuery<ProposalVotesInfo>(
    [CELATONE_QUERY_KEYS.PROPOSAL_VOTES_INFO, endpoint, id],
    async () => queryFn(endpoint, id),
    { enabled, refetchOnWindowFocus: false, retry: 1 }
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
    { refetchOnWindowFocus: false, retry: 1, ...options }
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
    { refetchOnWindowFocus: false, retry: 1, ...options }
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
    { enabled, refetchOnWindowFocus: false, retry: 1 }
  );
};
