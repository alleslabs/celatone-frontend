import type { Coin } from "@cosmjs/amino";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { Big } from "big.js";
import { useCallback } from "react";

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
import { big } from "lib/types";
import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  Nullish,
  Option,
  Proposal,
  ProposalParams,
  ProposalStatus,
  ProposalType,
  ProposalVotesInfo,
  ProposalVoteType,
  Token,
  U,
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
  ProposalsResponse,
  ProposalVotesResponse,
  RelatedProposalsResponse,
  UploadAccess,
  VotingParamsInternal,
} from "./proposal";
import {
  fetchGovDepositParams,
  fetchGovUploadAccessParams,
  fetchGovVotingParams,
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
  search: string
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
    { retry: 1, refetchOnWindowFocus: false }
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
