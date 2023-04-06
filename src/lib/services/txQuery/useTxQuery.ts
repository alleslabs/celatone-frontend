import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp, useGetAddressType } from "lib/app-provider";
import type {
  TxFilters,
  Message,
  Option,
  HumanAddr,
  ContractAddr,
  Transaction,
  Addr,
} from "lib/types";
import {
  getActionMsgType,
  parseTxHash,
  snakeToCamel,
  getMsgFurtherAction,
  parseDateOpt,
} from "lib/utils";

import {
  generateWhereForContractTx,
  generateWhereForContractTxView,
  generateWhereForTx,
} from "./generateWhere";
import {
  queryTransactionCountFromContractTxs,
  queryTransactionFromContractTxs,
  queryTransactionsCountFromTxs,
  queryTransactionsFromTxs,
} from "./graphqlQuery";

interface GraphqlTransactionsResponse {
  hash: string;
  sender: Addr;
  isSend: boolean;
  isExecute: boolean;
  isIbc: boolean;
  isInstantiate: boolean;
  isStoreCode: boolean;
  isClearAdmin: boolean;
  isMigrate: boolean;
  isUpdateAdmin: boolean;
  messages: Message[];
  success: boolean;
  blockHeight: number;
  block: {
    timestamp: string;
  };
}

interface GraphqlTransactionsViewResponse {
  hash: string;
  sender: Addr;
  isSend: boolean;
  isExecute: boolean;
  isIbc: boolean;
  isInstantiate: boolean;
  isStoreCode: boolean;
  isClearAdmin: boolean;
  isMigrate: boolean;
  isUpdateAdmin: boolean;
  messages: Message[];
  success: boolean;
  height: number;
  timestamp: string;
}

export const useTxQuery = (
  userAddress: Option<HumanAddr>,
  search: string,
  filters: TxFilters,
  pageSize: number,
  offset: number
) => {
  const getAddressType = useGetAddressType();
  const { indexerGraphClient } = useCelatoneApp();

  // Filter when action buttons are pressed
  const queryFn = useCallback(async () => {
    if (!userAddress) throw new Error("User address not found");

    // Search with contract address -> query from contract transaction table
    if (getAddressType(search) === "contract_address") {
      const where = generateWhereForContractTxView({
        userAddress,
        contractAddress: search as ContractAddr,
        filters,
      });
      return indexerGraphClient
        .request(queryTransactionFromContractTxs(where), {
          pageSize,
          offset,
        })
        .then(({ contract_transactions_view }) => {
          const contractTransactionsToCamel = snakeToCamel(
            contract_transactions_view
          ) as GraphqlTransactionsViewResponse[];
          return contractTransactionsToCamel.map(
            (contractTx): Transaction => ({
              hash: parseTxHash(contractTx.hash),
              messages: snakeToCamel(contractTx.messages) as Message[],
              sender: contractTx.sender,
              height: contractTx.height,
              created: parseDateOpt(contractTx.timestamp),
              success: contractTx.success,
              actionMsgType: getActionMsgType([
                contractTx.isExecute,
                contractTx.isInstantiate,
                contractTx.isSend,
                contractTx.isStoreCode,
                contractTx.isMigrate,
                contractTx.isUpdateAdmin,
                contractTx.isClearAdmin,
              ]),
              furtherAction: getMsgFurtherAction(
                contractTx.messages.length,
                {
                  isExecute: contractTx.isExecute,
                  isInstantiate: contractTx.isInstantiate,
                  isSend: contractTx.isSend,
                  isUpload: contractTx.isStoreCode,
                  isMigrate: contractTx.isMigrate,
                  isUpdateAdmin: contractTx.isUpdateAdmin,
                  isClearAdmin: contractTx.isClearAdmin,
                  isIbc: contractTx.isIbc,
                },
                contractTx.success
              ),
              isIbc: contractTx.isIbc,
              isInstantiate: contractTx.isInstantiate,
            })
          );
        });
    }

    const where = generateWhereForTx({
      userAddress,
      txHash: search,
      filters,
    });
    return indexerGraphClient
      .request(queryTransactionsFromTxs(where), {
        pageSize,
        offset,
      })
      .then(({ transactions }) => {
        const transactionsToCamel = snakeToCamel(
          transactions
        ) as GraphqlTransactionsResponse[];
        return transactionsToCamel.map((transaction): Transaction => {
          return {
            hash: parseTxHash(transaction.hash),
            messages: snakeToCamel(transaction.messages) as Message[],
            sender: transaction.sender,
            height: transaction.blockHeight,
            created: parseDateOpt(transaction.block?.timestamp),
            success: transaction.success,
            actionMsgType: getActionMsgType([
              transaction.isExecute,
              transaction.isInstantiate,
              transaction.isSend,
              transaction.isStoreCode,
              transaction.isMigrate,
              transaction.isUpdateAdmin,
              transaction.isClearAdmin,
            ]),
            furtherAction: getMsgFurtherAction(
              transaction.messages.length,
              {
                isExecute: transaction.isExecute,
                isInstantiate: transaction.isInstantiate,
                isSend: transaction.isSend,
                isUpload: transaction.isStoreCode,
                isMigrate: transaction.isMigrate,
                isUpdateAdmin: transaction.isUpdateAdmin,
                isClearAdmin: transaction.isClearAdmin,
                isIbc: transaction.isIbc,
              },
              transaction.success
            ),
            isIbc: transaction.isIbc,
            isInstantiate: transaction.isInstantiate,
          };
        });
      });
  }, [
    filters,
    getAddressType,
    indexerGraphClient,
    offset,
    pageSize,
    search,
    userAddress,
  ]);

  return useQuery({
    queryKey: [
      "past-transaction",
      userAddress,
      search,
      filters,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn,
    enabled: !!userAddress,
  });
};

export const useTxQueryCount = (
  userAddress: Option<string>,
  search: string,
  filters: TxFilters
): UseQueryResult<number> => {
  const getAddressType = useGetAddressType();
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!userAddress) throw new Error("User address not found");

    if (getAddressType(search) === "contract_address") {
      const where = generateWhereForContractTx({
        userAddress: userAddress as HumanAddr,
        contractAddress: search as ContractAddr,
        filters,
      });

      return indexerGraphClient
        .request(queryTransactionCountFromContractTxs(where))
        .then(
          ({ contract_transactions_aggregate }) =>
            contract_transactions_aggregate.aggregate.count
        );
    }

    const where = generateWhereForTx({
      userAddress: userAddress as HumanAddr,
      txHash: search,
      filters,
    });
    return indexerGraphClient
      .request(queryTransactionsCountFromTxs(where))
      .then(
        ({ transactions_aggregate }) => transactions_aggregate.aggregate.count
      );
  }, [filters, getAddressType, indexerGraphClient, search, userAddress]);

  return useQuery({
    queryKey: [
      "past-transaction-count",
      userAddress,
      search,
      filters,
      indexerGraphClient,
    ],
    queryFn,
    enabled: !!userAddress,
  });
};
