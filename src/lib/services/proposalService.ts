import type { Coin } from "@cosmjs/amino";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { Big } from "big.js";
import big from "big.js";
import { isUndefined } from "lodash";
import { useCallback, useMemo } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
} from "lib/app-provider";
import {
  getRelatedProposalsByModuleIdPagination,
  getRelatedProposalsCountByModuleId,
} from "lib/query";
import { createQueryFnWithTimeout } from "lib/query-utils";
import {
  type ProposalParams,
  type Option,
  type ProposalStatus,
  type ProposalType,
  type Proposal,
  type U,
  type Token,
  type Nullish,
  type BechAddr32,
  type BechAddr,
  type BechAddr20,
  type ProposalVotesInfo,
  ProposalValidatorVoteType,
} from "lib/types";
import {
  coinToTokenWithValue,
  deexponentify,
  formatTokenWithValue,
  getTokenLabel,
  parseDate,
} from "lib/utils";

import { useAssetInfos } from "./assetService";
import { useMovePoolInfos } from "./move";
import type {
  DepositParamsInternal,
  ProposalAnswerCountsResponse,
  ProposalDataResponse,
  ProposalValidatorVotesResponse,
  ProposalVotesResponse,
  ProposalsResponse,
  RelatedProposalsResponse,
  UploadAccess,
  VotingParamsInternal,
} from "./proposal";
import {
  fetchGovVotingParams,
  fetchGovDepositParams,
  fetchGovUploadAccessParams,
  getProposalsByAddress,
  getProposals,
  getProposalData,
  getProposalParams,
  getProposalTypes,
  getProposalAnswerCounts,
  getProposalVotes,
  getProposalValidatorVotes,
  getProposalVotesInfo,
  getRelatedProposalsByContractAddress,
} from "./proposal";

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

export const useProposalParams = () => {
  const endpoint = useBaseApiRoute("proposals");
  return useQuery<ProposalParams<Coin>>(
    [CELATONE_QUERY_KEYS.PROPOSAL_PARAMS, endpoint],
    async () => getProposalParams(endpoint),
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

export const useRelatedProposalsByModuleIdPagination = (
  moduleId: Nullish<number>,
  offset: number,
  pageSize: number
): UseQueryResult<Proposal[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!moduleId) throw new Error("Module id not found");
    return indexerGraphClient
      .request(getRelatedProposalsByModuleIdPagination, {
        moduleId,
        offset,
        pageSize,
      })
      .then(({ module_proposals }) =>
        module_proposals.map<Proposal>((proposal) => ({
          id: proposal.proposal_id,
          title: proposal.proposal.title,
          status: proposal.proposal.status as ProposalStatus,
          votingEndTime: parseDate(proposal.proposal.voting_end_time),
          depositEndTime: parseDate(proposal.proposal.deposit_end_time),
          resolvedHeight: proposal.proposal.resolved_height ?? null,
          // TODO: fix
          types: [proposal.proposal.type as ProposalType],
          proposer: proposal.proposal.account?.address as BechAddr,
          isExpedited: Boolean(proposal.proposal.is_expedited),
        }))
      );
  }, [indexerGraphClient, moduleId, offset, pageSize]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSALS_BY_MODULE_ID,
      moduleId,
      indexerGraphClient,
      offset,
      pageSize,
    ],
    queryFn,
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useRelatedProposalsCountByModuleId = (
  moduleId: Nullish<number>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!moduleId) throw new Error("Module id not found");
    return indexerGraphClient
      .request(getRelatedProposalsCountByModuleId, {
        moduleId,
      })
      .then(
        ({ module_proposals_aggregate }) =>
          module_proposals_aggregate?.aggregate?.count
      );
  }, [indexerGraphClient, moduleId]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSALS_COUNT_BY_MODULE_ID,
      moduleId,
      indexerGraphClient,
    ],
    createQueryFnWithTimeout(queryFn),
    {
      keepPreviousData: true,
    }
  );
};

export interface MinDeposit {
  amount: U<Token<Big>>;
  denom: string;
  formattedAmount: Token;
  formattedDenom: string;
  formattedToken: string;
  precision: number;
}

interface DepositParamsReturn
  extends Omit<DepositParamsInternal, "minDeposit"> {
  minDeposit: MinDeposit;
  minInitialDeposit: Token;
}

export interface GovParams {
  depositParams: DepositParamsReturn;
  uploadAccess: UploadAccess;
  votingParams: VotingParamsInternal;
}

export const useGovParams = (): UseQueryResult<GovParams> => {
  const lcdEndpoint = useBaseApiRoute("rest");
  const cosmwasmEndpoint = useBaseApiRoute("cosmwasm");
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const { data: movePoolInfos } = useMovePoolInfos({ withPrices: false });

  const queryFn = useCallback(
    () =>
      Promise.all([
        fetchGovDepositParams(lcdEndpoint),
        fetchGovUploadAccessParams(cosmwasmEndpoint),
        fetchGovVotingParams(lcdEndpoint),
      ]).then<GovParams>((params) => {
        const minDepositParam = params[0].minDeposit[0];
        const minDepositToken = coinToTokenWithValue(
          minDepositParam.denom,
          minDepositParam.amount,
          assetInfos,
          movePoolInfos
        );
        const minDepositAmount = deexponentify(
          minDepositToken.amount,
          minDepositToken.precision
        ).toFixed() as Token;

        return {
          depositParams: {
            ...params[0],
            minDeposit: {
              ...minDepositParam,
              amount: minDepositToken.amount,
              formattedAmount: minDepositAmount,
              formattedDenom: getTokenLabel(
                minDepositToken.denom,
                minDepositToken.symbol
              ),
              formattedToken: formatTokenWithValue(minDepositToken),
              precision: minDepositToken.precision ?? 0,
            },
            minInitialDeposit: big(params[0].minInitialDepositRatio)
              .times(minDepositAmount)
              .toFixed(2) as Token,
          },
          uploadAccess: params[1],
          votingParams: params[2],
        };
      }),
    [assetInfos, cosmwasmEndpoint, lcdEndpoint, movePoolInfos]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.GOV_PARAMS, lcdEndpoint, assetInfos],
    queryFn,
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );
};

export const useUploadAccessParams = (): UseQueryResult<UploadAccess> => {
  const cosmwasmEndpoint = useBaseApiRoute("cosmwasm");
  return useQuery(
    [CELATONE_QUERY_KEYS.UPLOAD_ACCESS_PARAMS, cosmwasmEndpoint],
    () => fetchGovUploadAccessParams(cosmwasmEndpoint),
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );
};

export const useProposalData = (id: number) => {
  const endpoint = useBaseApiRoute("proposals");

  return useQuery<ProposalDataResponse>(
    [CELATONE_QUERY_KEYS.PROPOSAL_DATA, endpoint, id],
    async () => getProposalData(endpoint, id),
    { retry: 1, keepPreviousData: true }
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

export const useProposalValidatorVotes = (
  id: number,
  limit: number,
  offset: number,
  answer?: ProposalValidatorVoteType,
  search?: string,
  options: Pick<
    UseQueryOptions<ProposalValidatorVotesResponse>,
    "onSuccess"
  > = {}
) => {
  const endpoint = useBaseApiRoute("proposals");

  const { data, ...rest } = useQuery<ProposalValidatorVotesResponse>(
    [CELATONE_QUERY_KEYS.PROPOSAL_VALIDATOR_VOTES, endpoint, id],
    async () => getProposalValidatorVotes(endpoint, id),
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );

  const filteredData = useMemo(() => {
    if (isUndefined(data?.items)) return undefined;

    const filteredItemsByAnswer = data.items.filter((vote) => {
      switch (answer) {
        case ProposalValidatorVoteType.YES:
          return vote.yes === 1;
        case ProposalValidatorVoteType.NO:
          return vote.no === 1;
        case ProposalValidatorVoteType.NO_WITH_VETO:
          return vote.noWithVeto === 1;
        case ProposalValidatorVoteType.ABSTAIN:
          return vote.abstain === 1;
        case ProposalValidatorVoteType.WEIGHTED:
          return vote.isVoteWeighted;
        case ProposalValidatorVoteType.DID_NOT_VOTE:
          return (
            vote.yes === 0 &&
            vote.no === 0 &&
            vote.noWithVeto === 0 &&
            vote.abstain === 0 &&
            !vote.isVoteWeighted
          );
        case ProposalValidatorVoteType.ALL:
        default:
          return true;
      }
    });

    const filteredItemsBySearch = filteredItemsByAnswer.filter((vote) => {
      if (!search?.trim()) return true;

      const keyword = search.toLowerCase();
      return (
        (vote.validator?.moniker?.toLowerCase() || "").includes(keyword) ||
        vote.validator?.validatorAddress.toLowerCase().includes(keyword)
      );
    });

    return {
      items: filteredItemsBySearch.slice(offset, offset + limit),
      total: filteredItemsBySearch.length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.items, limit, offset, answer, search]);

  return { data: filteredData, ...rest };
};

export const useProposalVotes = (
  id: number,
  limit: number,
  offset: number,
  answer?: string,
  search?: string,
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
