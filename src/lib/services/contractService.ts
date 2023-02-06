import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import {
  getInstantiatedListByUserQueryDocument,
  getInstantiatedCountByUserQueryDocument,
  getInstantiateDetailByContractQueryDocument,
  getExecuteTxsCountByContractAddress,
  getExecuteTxsByContractAddress,
  getMigrationHistoriesCountByContractAddress,
  getMigrationHistoriesByContractAddress,
  getTxsCountByContractAddress,
  getTxsByContractAddress,
  getRelatedProposalsCountByContractAddress,
  getRelatedProposalsByContractAddress,
  getAdminByContractAddressesQueryDocument,
  getContractListByAdmin,
} from "lib/data/queries";
import { useChainId } from "lib/hooks";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  ContractAddr,
  ContractMigrationHistory,
  ContractRelatedProposals,
  ExecuteTransaction,
  AllTransaction,
  HumanAddr,
  MigrationRemark,
  Option,
  ProposalStatus,
  ProposalType,
  Dict,
} from "lib/types";
import {
  parseDate,
  getActionMsgType,
  parseDateDefault,
  parseTxHash,
  parseTxHashOpt,
  snakeToCamel,
  unwrap,
} from "lib/utils";

interface InstantiateDetail {
  initMsg: string;
  initTxHash?: string;
  initProposalId?: number;
  initProposalTitle?: string;
}

export const useInstantiatedCountByUserQuery = (
  walletAddr: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    if (!walletAddr)
      throw new Error(
        "Wallet address not found (useInstantiatedCountByUserQuery)"
      );

    return indexerGraphClient
      .request(getInstantiatedCountByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [indexerGraphClient, walletAddr]);

  return useQuery(
    ["instantiated_count_by_user", walletAddr, chainId],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!walletAddr,
    }
  );
};

export const useInstantiatedListByUserQuery = (
  walletAddr: Option<HumanAddr>
): UseQueryResult<Option<ContractLocalInfo[]>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    if (!walletAddr)
      throw new Error(
        "Wallet address not found (useInstantiatedListByUserQuery)"
      );

    return indexerGraphClient
      .request(getInstantiatedListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts }) =>
        contracts.map<ContractLocalInfo>((contract) => ({
          contractAddress: contract.address as ContractAddr,
          instantiator: unwrap(contract.accountByInitBy?.address),
          label: contract.label,
        }))
      );
  }, [indexerGraphClient, walletAddr]);

  return useQuery(["instantiated_list_by_user", walletAddr, chainId], queryFn, {
    keepPreviousData: true,
    enabled: !!walletAddr,
  });
};

export const useContractListByAdmin = (
  adminAddress: Option<ContractAddr | HumanAddr>
): UseQueryResult<Option<ContractLocalInfo[]>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    if (!adminAddress)
      throw new Error("Admin address not found (useContractListByAdmin)");

    return indexerGraphClient
      .request(getContractListByAdmin, {
        address: adminAddress,
      })
      .then(({ contracts }) =>
        contracts.map<ContractLocalInfo>((contract) => ({
          contractAddress: contract.address as ContractAddr,
          instantiator: contract.accountByInitBy?.address ?? "",
          label: contract.label,
        }))
      );
  }, [adminAddress, indexerGraphClient]);

  return useQuery(["contract_list_by_admin", adminAddress, chainId], queryFn, {
    keepPreviousData: true,
    enabled: !!adminAddress,
  });
};

export const useInstantiateDetailByContractQuery = (
  contractAddress: ContractAddr
): UseQueryResult<InstantiateDetail> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getInstantiateDetailByContractQueryDocument, { contractAddress })
      .then(({ contracts_by_pk }) => ({
        initMsg: contracts_by_pk?.init_msg ?? "{}",
        initTxHash: parseTxHashOpt(contracts_by_pk?.transaction?.hash),
        initProposalId: contracts_by_pk?.contract_proposals.at(0)?.proposal.id,
        initProposalTitle:
          contracts_by_pk?.contract_proposals.at(0)?.proposal.title,
      }));
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    ["instantiate_detail_by_contract", contractAddress, chainId],
    queryFn,
    {
      keepPreviousData: true,
    }
  );
};

export const useAdminByContractAddresses = (
  contractAddresses: Option<ContractAddr[]>
): UseQueryResult<Option<Dict<ContractAddr, string>>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    if (!contractAddresses)
      throw new Error("No contract selected (useAdminByContractAddresses)");

    return indexerGraphClient
      .request(getAdminByContractAddressesQueryDocument, {
        contractAddresses,
      })
      .then(({ contracts }) =>
        contracts.reduce(
          (prev, contract) => ({
            ...prev,
            [contract.address as ContractAddr]: contract.admin?.address,
          }),
          {}
        )
      );
  }, [contractAddresses, indexerGraphClient]);

  return useQuery(["admin_by_contracts", contractAddresses, chainId], queryFn, {
    keepPreviousData: true,
    enabled: !!contractAddresses,
  });
};

export const useExecuteTxsByContractAddress = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<Option<ExecuteTransaction[]>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getExecuteTxsByContractAddress, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_transactions }) =>
        contract_transactions.map((transaction) => ({
          hash: parseTxHash(transaction.transaction.hash),
          messages: transaction.transaction.messages,
          sender: transaction.transaction.account.address as
            | ContractAddr
            | HumanAddr,
          height: transaction.transaction.block.height,
          created: parseDateDefault(transaction.transaction?.block?.timestamp),
          success: transaction.transaction.success,
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      "execute_transactions_by_contract_addr",
      contractAddress,
      offset,
      pageSize,
      chainId,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useExecuteTxsCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    if (!contractAddress)
      throw new Error(
        "Contract address not found (useExecuteTxsCountByContractAddress)"
      );

    return indexerGraphClient
      .request(getExecuteTxsCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_transactions_aggregate }) =>
          contract_transactions_aggregate?.aggregate?.count
      );
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    ["execute_transactions_count_by_contract_addr", contractAddress, chainId],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useMigrationHistoriesByContractAddress = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<
  Option<Omit<ContractMigrationHistory, "codeDescription">[]>
> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getMigrationHistoriesByContractAddress, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_histories }) =>
        contract_histories.map<
          Omit<ContractMigrationHistory, "codeDescription">
        >((history) => ({
          codeId: history.code_id,
          sender: history.account.address as HumanAddr | ContractAddr,
          height: history.block.height,
          timestamp: parseDate(history.block.timestamp),
          remark: {
            operation: history.remark.operation as MigrationRemark["operation"],
            type: history.remark.type as MigrationRemark["type"],
            value: history.remark.value as MigrationRemark["value"],
          },
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    ["migration_histories", contractAddress, offset, pageSize, chainId],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useMigrationHistoriesCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getMigrationHistoriesCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_histories_aggregate }) =>
          contract_histories_aggregate.aggregate?.count
      );
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    ["migration_histories_count", contractAddress, chainId],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useTxsByContractAddress = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<AllTransaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getTxsByContractAddress, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_transactions }) =>
        contract_transactions.map((contractTx) => ({
          hash: parseTxHash(contractTx.transaction.hash),
          messages: snakeToCamel(contractTx.transaction.messages),
          sender: contractTx.transaction.account.address as
            | ContractAddr
            | HumanAddr,
          height: contractTx.transaction.block.height,
          created: parseDateDefault(contractTx.transaction.block?.timestamp),
          success: contractTx.transaction.success,
          actionMsgType: getActionMsgType([
            contractTx.transaction.is_execute,
            contractTx.transaction.is_instantiate,
            contractTx.transaction.is_send,
            contractTx.transaction.is_store_code,
            contractTx.transaction.is_migrate,
            contractTx.transaction.is_update_admin,
            contractTx.transaction.is_clear_admin,
          ]),
          isIbc: contractTx.transaction.is_ibc,
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      "transactions_by_contract_addr",
      contractAddress,
      offset,
      pageSize,
      chainId,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useTxsCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

  const queryFn = useCallback(async () => {
    if (!contractAddress)
      throw new Error(
        "Contract address not found (useTxsCountByContractAddress)"
      );

    return indexerGraphClient
      .request(getTxsCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_transactions_aggregate }) =>
          contract_transactions_aggregate.aggregate?.count
      );
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    ["transactions_count_by_contract_addr", contractAddress, chainId],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useRelatedProposalsByContractAddress = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<Option<ContractRelatedProposals[]>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const chainId = useChainId();

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
          proposer: proposal.proposal.account?.address as
            | HumanAddr
            | ContractAddr,
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    ["related_proposals", contractAddress, offset, pageSize, chainId],
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
  const chainId = useChainId();

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
    ["related_proposals_count", contractAddress, chainId],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};
