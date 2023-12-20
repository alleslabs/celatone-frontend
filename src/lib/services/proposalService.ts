import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import big from "big.js";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
} from "lib/app-provider";
import {
  getProposalList,
  getProposalListCount,
  getProposalsByWalletAddressPagination,
  getProposalsCountByWalletAddress,
  getProposalTypes,
  getRelatedProposalsByContractAddressPagination,
  getRelatedProposalsByModuleIdPagination,
  getRelatedProposalsCountByContractAddress,
  getRelatedProposalsCountByModuleId,
} from "lib/query";
import { createQueryFnWithTimeout } from "lib/query-utils";
import type {
  ContractAddr,
  HumanAddr,
  Option,
  ProposalStatus,
  ProposalType,
  Addr,
  Proposal,
  U,
  Token,
  Nullish,
} from "lib/types";
import {
  deexponentify,
  formatBalanceWithDenom,
  getTokenLabel,
  parseDate,
  parseProposalStatus,
} from "lib/utils";

import { useAssetInfos } from "./assetService";
import { useProposalListExpression } from "./expression";
import type {
  DepositParamsInternal,
  ProposalResponse,
  UploadAccess,
  VotingParamsInternal,
} from "./proposal";
import {
  fetchGovVotingParams,
  fetchGovDepositParams,
  fetchGovUploadAccessParams,
  getProposalsByAddress,
} from "./proposal";

export const useRelatedProposalsByContractAddressPagination = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<Proposal[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getRelatedProposalsByContractAddressPagination, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_proposals }) =>
        contract_proposals.map<Proposal>((proposal) => ({
          proposalId: proposal.proposal_id,
          title: proposal.proposal.title,
          status: parseProposalStatus(proposal.proposal.status),
          votingEndTime: parseDate(proposal.proposal.voting_end_time),
          depositEndTime: parseDate(proposal.proposal.deposit_end_time),
          resolvedHeight: proposal.resolved_height,
          type: proposal.proposal.type as ProposalType,
          proposer: proposal.proposal.account?.address as Addr,
          isExpedited: Boolean(proposal.proposal.is_expedited),
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.RELATED_PROPOSALS_BY_CONTRACT_ADDRESS_PAGINATION,
      contractAddress,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useRelatedProposalsCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getRelatedProposalsCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_proposals_aggregate }) =>
          contract_proposals_aggregate.aggregate?.count
      );
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.RELATED_PROPOSALS_BY_CONTRACT_ADDRESS_COUNT,
      contractAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useProposalsByAddress = (
  address: Addr,
  offset: number,
  limit: number
): UseQueryResult<ProposalResponse> => {
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

export const useProposalsByWalletAddressPagination = (
  walletAddress: HumanAddr,
  offset: number,
  pageSize: number
): UseQueryResult<Proposal[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getProposalsByWalletAddressPagination, {
        walletAddress: walletAddress as HumanAddr,
        offset,
        pageSize,
      })
      .then(({ proposals }) =>
        proposals.map<Proposal>((proposal) => ({
          proposalId: proposal.id,
          title: proposal.title,
          status: parseProposalStatus(proposal.status),
          votingEndTime: parseDate(proposal.voting_end_time),
          depositEndTime: parseDate(proposal.deposit_end_time),
          resolvedHeight: proposal.resolved_height,
          type: proposal.type as ProposalType,
          proposer: walletAddress,
          isExpedited: Boolean(proposal.is_expedited),
        }))
      );
  }, [indexerGraphClient, offset, pageSize, walletAddress]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSALS_BY_WALLET_ADDRESS_PAGINATION,
      walletAddress,
      indexerGraphClient,
      offset,
      pageSize,
    ],
    createQueryFnWithTimeout(queryFn),
    {
      enabled: !!walletAddress,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useProposalsCountByWalletAddress = (
  walletAddress: HumanAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getProposalsCountByWalletAddress, {
        walletAddress,
      })
      .then(({ proposals_aggregate }) => proposals_aggregate?.aggregate?.count);
  }, [walletAddress, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSALS_BY_WALLET_ADDRESS_COUNT,
      walletAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!walletAddress,
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
          proposalId: proposal.proposal_id,
          title: proposal.proposal.title,
          status: parseProposalStatus(proposal.proposal.status),
          votingEndTime: parseDate(proposal.proposal.voting_end_time),
          depositEndTime: parseDate(proposal.proposal.deposit_end_time),
          resolvedHeight: proposal.proposal.resolved_height,
          type: proposal.proposal.type as ProposalType,
          proposer: proposal.proposal.account?.address as Addr,
          isExpedited: Boolean(proposal.proposal.is_expedited),
        }))
      );
  }, [indexerGraphClient, moduleId, offset, pageSize]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSALS_BY_WALLET_ADDRESS_PAGINATION,
      moduleId,
      indexerGraphClient,
      offset,
      pageSize,
    ],
    createQueryFnWithTimeout(queryFn),
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
      CELATONE_QUERY_KEYS.PROPOSALS_BY_WALLET_ADDRESS_COUNT,
      moduleId,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
    }
  );
};

export const useProposalList = (
  offset: number,
  pageSize: number,
  statuses: ProposalStatus[],
  types: ProposalType[],
  search: string,
  proposer: Option<Addr>
): UseQueryResult<Proposal[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = useProposalListExpression(
    statuses,
    types,
    search,
    proposer
  );

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getProposalList, {
          expression,
          offset,
          pageSize,
        })
        .then(({ proposals }) =>
          proposals.map<Proposal>((proposal) => ({
            proposalId: proposal.id,
            title: proposal.title,
            status: parseProposalStatus(proposal.status),
            votingEndTime: parseDate(proposal.voting_end_time),
            depositEndTime: parseDate(proposal.deposit_end_time),
            resolvedHeight: proposal.resolved_height,
            type: proposal.type as ProposalType,
            proposer: proposal.account?.address as Addr,
            isExpedited: Boolean(proposal.is_expedited),
          }))
        ),
    [indexerGraphClient, offset, pageSize, expression]
  );
  return useQuery(
    [
      CELATONE_QUERY_KEYS.PROPOSALS,
      indexerGraphClient,
      expression,
      offset,
      pageSize,
    ],
    queryFn
  );
};

export const useProposalListCount = (
  statuses: ProposalStatus[],
  types: ProposalType[],
  search: string,
  proposer: Option<Addr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = useProposalListExpression(
    statuses,
    types,
    search,
    proposer
  );
  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getProposalListCount, { expression })
        .then(
          ({ proposals_aggregate }) => proposals_aggregate?.aggregate?.count
        ),
    [indexerGraphClient, expression]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.PROPOSALS_COUNT, indexerGraphClient, expression],
    queryFn
  );
};

export const useProposalTypes = (): UseQueryResult<ProposalType[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getProposalTypes)
        .then(({ proposals }) =>
          proposals.map((proposal) => proposal.type).sort()
        ),
    [indexerGraphClient]
  );
  return useQuery(
    [CELATONE_QUERY_KEYS.PROPOSAL_TYPES, indexerGraphClient],
    queryFn
  );
};

export interface MinDeposit {
  amount: U<Token>;
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
  const queryFn = useCallback(
    () =>
      Promise.all([
        fetchGovDepositParams(lcdEndpoint),
        fetchGovUploadAccessParams(cosmwasmEndpoint),
        fetchGovVotingParams(lcdEndpoint),
      ]).then<GovParams>((params) => {
        const minDepositParam = params[0].minDeposit[0];
        const assetInfo = assetInfos?.[minDepositParam.denom];
        const [minDepositAmount, minDepositDenom] = [
          deexponentify(
            minDepositParam.amount as U<Token>,
            assetInfo?.precision
          ).toFixed(),
          getTokenLabel(minDepositParam.denom, assetInfo?.symbol),
        ];
        return {
          depositParams: {
            ...params[0],
            minDeposit: {
              ...minDepositParam,
              amount: minDepositParam.amount as U<Token>,
              formattedAmount: minDepositAmount as Token,
              formattedDenom: minDepositDenom,
              formattedToken: formatBalanceWithDenom({
                coin: minDepositParam,
                precision: assetInfo?.precision,
                symbol: assetInfo?.symbol,
              }),
              precision: assetInfo?.precision ?? 0,
            },
            minInitialDeposit: big(params[0].minInitialDepositRatio)
              .times(minDepositAmount)
              .toFixed(2) as Token,
          },
          uploadAccess: params[1],
          votingParams: params[2],
        };
      }),
    [lcdEndpoint, cosmwasmEndpoint, assetInfos]
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
