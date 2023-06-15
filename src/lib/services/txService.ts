import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useBaseApiRoute, useCelatoneApp } from "lib/app-provider";
import {
  getTxsByAddressPagination,
  getTxsCountByAddress,
  getTxs,
  getTxsCount,
  getBlockTransactionCountByHeightQueryDocument,
  getBlockTransactionsByHeightQueryDocument,
} from "lib/query";
import { createQueryFnWithTimeout } from "lib/query-utils";
import type { Addr, Option, Transaction, TxFilters, Message } from "lib/types";
import { MsgFurtherAction } from "lib/types";
import {
  getActionMsgType,
  getMsgFurtherAction,
  isTxHash,
  parseDate,
  parseTxHash,
  snakeToCamel,
} from "lib/utils";

import { useTxExpression } from "./expression";
import type { TxResponse } from "./tx";
import { queryTxData } from "./tx";

export interface TxData extends TxResponse {
  chainId: string;
  isTxFailed: boolean;
}

export const useTxData = (txHash: Option<string>): UseQueryResult<TxData> => {
  const { currentChainId } = useCelatoneApp();
  const txsApiRoute = useBaseApiRoute("txs");
  const queryFn = useCallback(
    async ({ queryKey }: QueryFunctionContext<string[]>): Promise<TxData> => {
      const txData = await queryTxData(queryKey[1], queryKey[2]);
      return {
        ...txData,
        chainId: currentChainId,
        isTxFailed: Boolean(txData.code),
      };
    },
    [currentChainId]
  );

  return useQuery({
    queryKey: ["tx_data", txsApiRoute, txHash] as string[],
    queryFn,
    enabled: Boolean(txHash && isTxHash(txHash)),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useTxsByAddressPagination = (
  address: Option<Addr>,
  accountId: Option<number>,
  search: string,
  filters: TxFilters,
  isSigner: Option<boolean>,
  offset: number,
  pageSize: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = useTxExpression({
    address,
    accountId,
    search,
    filters,
    isSigner,
  });

  const queryFn = useCallback(async () => {
    if (!address && !accountId) return [];
    return indexerGraphClient
      .request(getTxsByAddressPagination, {
        expression,
        offset,
        pageSize,
      })
      .then<Transaction[]>(({ account_transactions }) =>
        account_transactions.map<Transaction>((transaction) => ({
          hash: parseTxHash(transaction.transaction.hash),
          messages: snakeToCamel(transaction.transaction.messages) as Message[],
          sender: transaction.transaction.account.address as Addr,
          isSigner: transaction.is_signer,
          height: transaction.block.height,
          created: parseDate(transaction.block.timestamp),
          success: transaction.transaction.success,
          actionMsgType: getActionMsgType([
            transaction.transaction.is_execute,
            transaction.transaction.is_instantiate,
            transaction.transaction.is_send,
            transaction.transaction.is_store_code,
            transaction.transaction.is_migrate,
            transaction.transaction.is_update_admin,
            transaction.transaction.is_clear_admin,
          ]),
          furtherAction: getMsgFurtherAction(
            transaction.transaction.messages.length,
            {
              isExecute: transaction.transaction.is_execute,
              isInstantiate: transaction.transaction.is_instantiate,
              isSend: transaction.transaction.is_send,
              isUpload: transaction.transaction.is_store_code,
              isMigrate: transaction.transaction.is_migrate,
              isUpdateAdmin: transaction.transaction.is_update_admin,
              isClearAdmin: transaction.transaction.is_clear_admin,
              isIbc: transaction.transaction.is_ibc,
            },
            transaction.transaction.success,
            transaction.is_signer
          ),
          isIbc: transaction.transaction.is_ibc,
          isInstantiate: transaction.transaction.is_instantiate,
        }))
      );
  }, [accountId, address, expression, indexerGraphClient, offset, pageSize]);
  return useQuery(
    [
      "transactions_by_address_pagination",
      address,
      accountId,
      search,
      filters,
      isSigner,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    createQueryFnWithTimeout(queryFn),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxsCountByAddress = (
  address: Option<Addr>,
  accountId: Option<number>,
  search: string,
  filters: TxFilters,
  isSigner: Option<boolean>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = useTxExpression({
    address,
    accountId,
    search,
    filters,
    isSigner,
  });

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getTxsCountByAddress, {
          expression,
        })
        .then(
          ({ account_transactions_aggregate }) =>
            account_transactions_aggregate.aggregate?.count
        ),
    [expression, indexerGraphClient]
  );

  return useQuery(
    [
      "transactions_count_by_address",
      address,
      search,
      filters,
      isSigner,
      indexerGraphClient,
    ],
    queryFn,
    {
      enabled: !!address || !!accountId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxs = (
  offset: number,
  pageSize: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getTxs, {
          offset,
          pageSize,
        })
        .then<Transaction[]>(({ transactions }) =>
          transactions.map<Transaction>((transaction) => ({
            hash: parseTxHash(transaction.hash),
            messages: snakeToCamel(transaction.messages) as Message[],
            sender: transaction.account.address as Addr,
            isSigner: false,
            height: transaction.block.height,
            created: parseDate(transaction.block.timestamp),
            success: transaction.success,
            actionMsgType: getActionMsgType([
              transaction.is_execute,
              transaction.is_instantiate,
              transaction.is_send,
              transaction.is_store_code,
              transaction.is_migrate,
              transaction.is_update_admin,
              transaction.is_clear_admin,
            ]),
            furtherAction: MsgFurtherAction.NONE,
            isIbc: transaction.is_ibc,
            isInstantiate: transaction.is_instantiate,
          }))
        ),
    [indexerGraphClient, offset, pageSize]
  );

  return useQuery(
    ["transaction_list", offset, pageSize, indexerGraphClient],
    queryFn
  );
};

export const useTxsCount = (): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getTxsCount)
        .then(({ transactions }) => transactions[0]?.id),
    [indexerGraphClient]
  );

  return useQuery(["transaction_list_count", indexerGraphClient], queryFn);
};

export const useTxsByBlockHeightPagination = (
  height: number,
  limit: number,
  offset: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getBlockTransactionsByHeightQueryDocument, {
          limit,
          offset,
          height,
        })
        .then<Transaction[]>(({ transactions }) =>
          transactions.map<Transaction>((transaction) => ({
            hash: parseTxHash(transaction.hash),
            messages: snakeToCamel(transaction.messages) as Message[],
            sender: transaction.account.address as Addr,
            isSigner: false,
            height,
            created: parseDate(transaction.block.timestamp),
            success: transaction.success,
            actionMsgType: getActionMsgType([
              transaction.is_execute,
              transaction.is_instantiate,
              transaction.is_send,
              transaction.is_store_code,
              transaction.is_migrate,
              transaction.is_update_admin,
              transaction.is_clear_admin,
            ]),
            furtherAction: MsgFurtherAction.NONE,
            isIbc: transaction.is_ibc,
            isInstantiate: transaction.is_instantiate,
          }))
        ),
    [height, limit, offset, indexerGraphClient]
  );

  return useQuery(
    [
      "transactions_by_block_height_pagination",
      indexerGraphClient,
      limit,
      offset,
      height,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!height,
    }
  );
};

export const useTxsCountByBlockHeight = (
  height: number
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getBlockTransactionCountByHeightQueryDocument, {
          height,
        })
        .then(
          ({ transactions_aggregate }) =>
            transactions_aggregate.aggregate?.count
        ),
    [height, indexerGraphClient]
  );

  return useQuery(
    ["transactions_count_by_block_height", indexerGraphClient, height],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!height,
    }
  );
};
