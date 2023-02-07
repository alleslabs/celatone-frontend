import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { useGetAddressType } from "lib/hooks";
import type {
  Filters,
  Message,
  Option,
  PastTransaction,
  HumanAddr,
  ContractAddr,
} from "lib/types";
import {
  getActionMsgType,
  parseDateDefault,
  parseTxHash,
  snakeToCamel,
  getMsgFurtherAction,
} from "lib/utils";

import {
  actionsFilter,
  generateWhereForContractTx,
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
  block: {
    timestamp: string;
  };
}

export const useTxQuery = (
  userAddress: Option<HumanAddr>,
  search: string,
  filters: Filters,
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
      const where = generateWhereForContractTx({
        userAddress,
        contractAddress: search as ContractAddr,
        filters,
      });
      return indexerGraphClient
        .request(queryTransactionFromContractTxs(where), {
          pageSize,
          offset,
        })
        .then(({ contract_transactions }) => {
          const contractTransactionsToCamel = snakeToCamel(
            contract_transactions
          ) as { transaction: GraphqlTransactionsResponse }[];
          return contractTransactionsToCamel.map(
            (contractTx: {
              transaction: GraphqlTransactionsResponse;
            }): PastTransaction => ({
              hash: parseTxHash(contractTx.transaction.hash),
              messages: snakeToCamel(
                contractTx.transaction.messages
              ) as Message[],
              // TODO - Remove default case
              created: parseDateDefault(
                contractTx.transaction.block?.timestamp
              ),
              success: contractTx.transaction.success,
              actionMsgType: getActionMsgType([
                contractTx.transaction.isExecute,
                contractTx.transaction.isInstantiate,
                contractTx.transaction.isSend,
                contractTx.transaction.isStoreCode,
                contractTx.transaction.isMigrate,
                contractTx.transaction.isUpdateAdmin,
                contractTx.transaction.isClearAdmin,
              ]),
              furtherAction: getMsgFurtherAction(
                contractTx.transaction.messages.length,
                {
                  isExecute: contractTx.transaction.isExecute,
                  isInstantiate: contractTx.transaction.isInstantiate,
                  isSend: contractTx.transaction.isSend,
                  isUpload: contractTx.transaction.isStoreCode,
                  isMigrate: contractTx.transaction.isMigrate,
                  isUpdateAdmin: contractTx.transaction.isUpdateAdmin,
                  isClearAdmin: contractTx.transaction.isClearAdmin,
                  isIbc: contractTx.transaction.isIbc,
                }
              ),
              isIbc: contractTx.transaction.isIbc,
              isInstantiate: contractTx.transaction.isInstantiate,
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
        return transactionsToCamel.map((transaction): PastTransaction => {
          return {
            hash: parseTxHash(transaction.hash),
            messages: snakeToCamel(transaction.messages) as Message[],
            // TODO - Remove default case
            created: parseDateDefault(transaction.block?.timestamp),
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
            furtherAction: getMsgFurtherAction(transaction.messages.length, {
              isExecute: transaction.isExecute,
              isInstantiate: transaction.isInstantiate,
              isSend: transaction.isSend,
              isUpload: transaction.isStoreCode,
              isMigrate: transaction.isMigrate,
              isUpdateAdmin: transaction.isUpdateAdmin,
              isClearAdmin: transaction.isClearAdmin,
              isIbc: transaction.isIbc,
            }),
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
  });
};

export const useTxQueryCount = (
  userAddress: Option<string>,
  search: string,
  filters: Filters
): UseQueryResult<number> => {
  const getAddressType = useGetAddressType();
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!userAddress) throw new Error("User address not found");

    if (getAddressType(search) === "contract_address") {
      return indexerGraphClient
        .request(queryTransactionCountFromContractTxs(actionsFilter(filters)), {
          userAddress,
          contractAddress: search,
        })
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
  });
};
