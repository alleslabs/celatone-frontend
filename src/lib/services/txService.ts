import { useWallet } from "@cosmos-kit/react";
import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp, useChainId } from "lib/app-provider";
import {
  getTxsByAddressPagination,
  getTxsCountByAddress,
  getTxs,
  getTxsCount,
  getTxsCountByPoolId,
  getTxsByPoolIdPagination,
  getBlockTransactionCountByHeightQueryDocument,
  getBlockTransactionsByHeightQueryDocument,
} from "lib/query";
import type {
  Addr,
  Option,
  PoolTxFilter,
  Transaction,
  TxFilters,
  BlockTransaction,
  Message,
} from "lib/types";
import { ActionMsgType, MsgFurtherAction } from "lib/types";
import {
  getActionMsgType,
  getMsgFurtherAction,
  isTxHash,
  parseDate,
  parseTxHash,
  snakeToCamel,
} from "lib/utils";

import { usePoolTxExpression, useTxExpression } from "./expression";
import type { TxResponse } from "./tx";
import { queryTxData } from "./tx";

export interface TxData extends TxResponse {
  chainId: string;
  isTxFailed: boolean;
}

export const useTxData = (txHash: Option<string>): UseQueryResult<TxData> => {
  const { currentChainName } = useWallet();
  const chainId = useChainId();
  const queryFn = useCallback(
    async ({ queryKey }: QueryFunctionContext<string[]>): Promise<TxData> => {
      const txData = await queryTxData(queryKey[1], queryKey[2], queryKey[3]);
      return {
        ...txData,
        chainId,
        isTxFailed: Boolean(txData.code),
      };
    },
    [chainId]
  );

  return useQuery({
    queryKey: ["tx_data", currentChainName, chainId, txHash] as string[],
    queryFn,
    enabled: Boolean(txHash && isTxHash(txHash)),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useTxsByAddressPagination = (
  address: Option<Addr>,
  search: string,
  filters: TxFilters,
  isSigner: Option<boolean>,
  offset: number,
  pageSize: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = useTxExpression(address, search, filters, isSigner);

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getTxsByAddressPagination, {
          expression,
          offset,
          pageSize,
        })
        .then(({ account_transactions }) =>
          account_transactions.map((transaction) => ({
            hash: parseTxHash(transaction.transaction.hash),
            messages: snakeToCamel(transaction.transaction.messages),
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
        ),
    [expression, indexerGraphClient, offset, pageSize]
  );

  return useQuery(
    [
      "transactions_by_address_pagination",
      address,
      search,
      filters,
      isSigner,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn,
    {
      enabled: !!address,
    }
  );
};

export const useTxsCountByAddress = (
  address: Option<Addr>,
  search: string,
  filters: TxFilters,
  isSigner: Option<boolean>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = useTxExpression(address, search, filters, isSigner);

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
      enabled: !!address,
    }
  );
};

export const useTxsByPoolIdPagination = (
  poolId: Option<number>,
  type: PoolTxFilter,
  offset: number,
  pageSize: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = usePoolTxExpression(poolId, type);

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getTxsByPoolIdPagination, {
        expression,
        offset,
        pageSize,
      })
      .then(({ pool_transactions }) =>
        pool_transactions.map((transaction) => ({
          hash: parseTxHash(transaction.transaction.hash),
          messages: snakeToCamel(transaction.transaction.messages),
          sender: transaction.transaction.account.address as Addr,
          isSigner: true,
          height: transaction.block.height,
          created: parseDate(transaction.block.timestamp),
          success: transaction.transaction.success,
          actionMsgType: ActionMsgType.OTHER_ACTION_MSG,
          furtherAction: MsgFurtherAction.NONE,
          isIbc: transaction.transaction.is_ibc,
          isInstantiate: false,
        }))
      );
  }, [expression, indexerGraphClient, offset, pageSize]);

  return useQuery(
    [
      "transactions_by_pool_id",
      poolId,
      type,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn,
    {
      enabled: !!poolId,
    }
  );
};

export const useTxsCountByPoolId = (
  poolId: Option<number>,
  type: PoolTxFilter
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = usePoolTxExpression(poolId, type);

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getTxsCountByPoolId, {
        expression,
      })
      .then(
        ({ pool_transactions_aggregate }) =>
          pool_transactions_aggregate.aggregate?.count
      );
  }, [expression, indexerGraphClient]);

  return useQuery(
    ["transactions_count_by_pool_id", poolId, type, indexerGraphClient],
    queryFn,
    {
      enabled: !!poolId,
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
        .then(({ transactions }) =>
          transactions.map((transaction) => ({
            hash: parseTxHash(transaction.hash),
            messages: snakeToCamel(transaction.messages),
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
): UseQueryResult<BlockTransaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getBlockTransactionsByHeightQueryDocument, {
          limit,
          offset,
          height,
        })
        .then(({ transactions }) =>
          transactions.map<BlockTransaction>((tx) => ({
            hash: parseTxHash(tx.hash),
            messages: snakeToCamel(tx.messages) as Message[],
            sender: tx.account.address as Addr,
            success: tx.success,
            actionMsgType: getActionMsgType([
              tx.is_execute,
              tx.is_instantiate,
              tx.is_send,
              tx.is_store_code,
              tx.is_migrate,
              tx.is_update_admin,
              tx.is_clear_admin,
            ]),
            isIbc: tx.is_ibc,
            isInstantiate: tx.is_instantiate,
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
