import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { indexerGraphClient } from "lib/data/graphql";
import {
  getInstantiatedListByUserQueryDocument,
  getInstantiatedCountByUserQueryDocument,
  getInstantiateDetailByContractQueryDocument,
  getExecuteTransactionsCountByContractAddress,
  getExecuteTransactionsByContractAddress,
} from "lib/data/queries";
import type { ContractInfo } from "lib/stores/contract";
import type {
  ContractAddr,
  ExecuteTransaction,
  HumanAddr,
  Option,
} from "lib/types";
import { parseDateDefault, parseTxHash } from "lib/utils";

interface InstantiateDetail {
  initMsg: string;
  initTxHash?: string;
}

export const useInstantiatedCountByUserQuery = (
  walletAddr: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const queryFn = useCallback(async () => {
    if (!walletAddr) return undefined;

    return indexerGraphClient
      .request(getInstantiatedCountByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [walletAddr]);

  // TODO: add query key later
  return useQuery(["instantiated_count_by_user", walletAddr], queryFn, {
    keepPreviousData: true,
    enabled: !!walletAddr,
  });
};

export const useInstantiatedListByUserQuery = (
  walletAddr: Option<HumanAddr>
): UseQueryResult<Option<ContractInfo[]>> => {
  const queryFn = useCallback(async () => {
    if (!walletAddr) return undefined;

    return indexerGraphClient
      .request(getInstantiatedListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts }) =>
        contracts.map<ContractInfo>((contract) => ({
          contractAddress: contract.address as ContractAddr,
          instantiator: walletAddr,
          label: contract.label,
          created: parseDateDefault(contract.transaction?.block?.timestamp),
        }))
      );
  }, [walletAddr]);

  // TODO: add query key later
  return useQuery(["instantiated_list_by_user", walletAddr], queryFn, {
    keepPreviousData: true,
    enabled: !!walletAddr,
  });
};

export const useInstantiateDetailByContractQuery = (
  contractAddress: ContractAddr
): UseQueryResult<InstantiateDetail> => {
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getInstantiateDetailByContractQueryDocument, { contractAddress })
      .then(({ contracts_by_pk }) => ({
        // TODO: revisit undefined after backend remove nullable
        initMsg: contracts_by_pk?.init_msg ?? "{}",
        initTxHash: parseTxHash(contracts_by_pk?.transaction?.hash),
      }));
  }, [contractAddress]);

  return useQuery(
    ["instantiate_detail_by_contract", contractAddress],
    queryFn,
    {
      keepPreviousData: true,
    }
  );
};

export const useExecuteTransactionsByContractAddress = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<ExecuteTransaction[] | undefined> => {
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getExecuteTransactionsByContractAddress, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_transactions }) =>
        contract_transactions.map((transaction) => ({
          hash: parseTxHash(transaction.transaction.hash),
          messages: transaction.transaction.messages,
          sender: transaction.transaction.account.address,
          height: transaction.transaction.block.height,
          created: parseDateDefault(transaction.transaction?.block?.timestamp),
          success: transaction.transaction.success,
        }))
      );
  }, [contractAddress, offset, pageSize]);

  return useQuery(
    [
      "execute_transactions_by_contract_addr",
      contractAddress,
      offset,
      pageSize,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useExecuteTransactionsCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<number | undefined> => {
  const queryFn = useCallback(async () => {
    if (!contractAddress) return undefined;

    return indexerGraphClient
      .request(getExecuteTransactionsCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_transactions_aggregate }) =>
          contract_transactions_aggregate?.aggregate?.count
      );
  }, [contractAddress]);

  return useQuery(
    ["execute_transactions_count_by_contract_addr", contractAddress],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};
