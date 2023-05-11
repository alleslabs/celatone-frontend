import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import big from "big.js";
import { useCallback } from "react";

import { useCelatoneApp, useLCDEndpoint } from "lib/app-provider";
import {
  getProposalList,
  getProposalListCount,
  getProposalsByWalletAddressPagination,
  getProposalsCountByWalletAddress,
  getProposalTypes,
  getRelatedProposalsByContractAddressPagination,
  getRelatedProposalsCountByContractAddress,
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
} from "lib/types";
import {
  demicrofy,
  formatBalanceWithDenom,
  getTokenLabel,
  parseDate,
  parseProposalStatus,
} from "lib/utils";

import { useProposalListExpression } from "./expression";
import type {
  DepositParamsInternal,
  UploadAccess,
  VotingParamsInternal,
} from "./proposal";
import {
  fetchGovVotingParams,
  fetchGovDepositParams,
  fetchGovUploadAccessParams,
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
      "related_proposals_by_contract_address_pagination",
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
      "related_proposals_count_by_contract_address",
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
      "proposals_by_wallet_address_pagination",
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
    ["proposals_count_by_wallet_address", walletAddress, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!walletAddress,
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
    ["proposal_list", indexerGraphClient, expression, offset, pageSize],
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
    ["proposal_list_count", indexerGraphClient, expression],
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
  return useQuery(["proposal_types", indexerGraphClient], queryFn);
};

export interface MinDeposit {
  amount: U<Token>;
  denom: string;
  formattedAmount: Token;
  formattedDenom: string;
  formattedToken: string;
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
  const lcdEndpoint = useLCDEndpoint();
  const queryFn = useCallback(
    () =>
      Promise.all([
        fetchGovDepositParams(lcdEndpoint),
        fetchGovUploadAccessParams(lcdEndpoint),
        fetchGovVotingParams(lcdEndpoint),
      ]).then<GovParams>((params) => {
        const minDepositParam = params[0].minDeposit[0];
        const [minDepositAmount, minDepositDenom] = [
          demicrofy(minDepositParam.amount as U<Token>).toFixed(),
          getTokenLabel(minDepositParam.denom),
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
                precision: 6,
                decimalPoints: 2,
              }),
            },
            minInitialDeposit: big(params[0].minInitialDepositRatio)
              .times(minDepositAmount)
              .toFixed(2) as Token,
          },
          uploadAccess: params[1],
          votingParams: params[2],
        };
      }),
    [lcdEndpoint]
  );

  return useQuery(["gov_params", lcdEndpoint], queryFn, {
    keepPreviousData: true,
  });
};
