import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import {
  getProposalsByUserAddress,
  getProposalsCountByUserAddress,
  getRelatedProposalsByContractAddress,
  getRelatedProposalsCountByContractAddress,
} from "lib/query/proposal";
import type {
  ContractAddr,
  ContractRelatedProposals,
  HumanAddr,
  Option,
  ProposalStatus,
  ProposalType,
  Addr,
  UserProposal,
} from "lib/types";
import { parseDate } from "lib/utils";

export const useRelatedProposalsByContractAddress = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<ContractRelatedProposals[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getRelatedProposalsByContractAddress, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_proposals }) =>
        contract_proposals.map<ContractRelatedProposals>((proposal) => ({
          proposalId: proposal.proposal_id,
          title: proposal.proposal.title,
          status: proposal.proposal.status as ProposalStatus,
          votingEndTime: parseDate(proposal.proposal.voting_end_time),
          depositEndTime: parseDate(proposal.proposal.deposit_end_time),
          resolvedHeight: proposal.resolved_height,
          type: proposal.proposal.type as ProposalType,
          proposer: proposal.proposal.account?.address as Addr,
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      "related_proposals",
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
    ["related_proposals_count", contractAddress, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useProposalsByUserAddressWithPagination = (
  offset: number,
  pageSize: number
): UseQueryResult<UserProposal> => {
  const { indexerGraphClient } = useCelatoneApp();
  const { address } = useWallet();
  const queryFn = useCallback(async () => {
    if (!address)
      throw new Error(
        "Wallet address not found (useProposalsByUserAddressWithPagination)"
      );

    return indexerGraphClient
      .request(getProposalsByUserAddress, {
        walletAddress: address as HumanAddr,
        offset,
        pageSize,
      })
      .then(({ proposals }) =>
        proposals.map((proposal) => ({
          proposalId: proposal.id,
          title: proposal.title,
          status: proposal.status as ProposalStatus,
          votingEndTime: parseDate(proposal.voting_end_time),
          depositEndTime: parseDate(proposal.deposit_end_time),
          type: proposal.type as ProposalType,
        }))
      );
  }, [indexerGraphClient, offset, pageSize, address]);

  return useQuery(
    [
      "proposal_by_user_address_pagination",
      address,
      indexerGraphClient,
      offset,
      pageSize,
    ],
    queryFn,
    {
      enabled: !!address,
    }
  );
};

export const useProposalsCountByUserAddress = (
  walletAddress: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useProposalsCountByUserAddress)"
      );

    return indexerGraphClient
      .request(getProposalsCountByUserAddress, {
        walletAddress,
      })
      .then(({ proposals_aggregate }) => proposals_aggregate?.aggregate?.count);
  }, [walletAddress, indexerGraphClient]);

  return useQuery(
    [
      "contract_list_count_by_admin_pagination",
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
