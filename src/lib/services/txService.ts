import type {
  QueryFunctionContext,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useMoveConfig,
  useWasmConfig,
} from "lib/app-provider";
import {
  getTxsByAddressPagination,
  getTxsCountByAddress,
  getTxsCount,
  getTxsCountByPoolId,
  getTxsByPoolIdPagination,
  getBlockTransactionCountByHeightQueryDocument,
  getBlockTransactionsByHeightQueryDocument,
  getModuleTransactionsQueryDocument,
  getModuleTransactionsCountQueryDocument,
} from "lib/query";
import { createQueryFnWithTimeout } from "lib/query-utils";
import type {
  Addr,
  Option,
  Transaction,
  TxFilters,
  Message,
  PoolTxFilter,
  Nullable,
  HumanAddr,
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
import type { TxResponse, TxsResponse } from "./tx";
import { getTxs, queryTxData } from "./tx";

export interface TxData extends TxResponse {
  chainId: string;
  isTxFailed: boolean;
}

export const useTxData = (
  txHash: Option<string>,
  enabled = true
): UseQueryResult<TxData> => {
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
    queryKey: [CELATONE_QUERY_KEYS.TX_DATA, txsApiRoute, txHash] as string[],
    queryFn,
    enabled: enabled && Boolean(txHash && isTxHash(txHash)),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useTxsByAddressPagination = (
  accountId: Option<Nullable<number>>,
  search: string,
  filters: TxFilters,
  isSigner: Option<boolean>,
  offset: number,
  pageSize: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });
  const expression = useTxExpression({
    accountId,
    search,
    filters,
    isSigner,
  });

  const queryFn = useCallback(async () => {
    if (!accountId) return [];
    return indexerGraphClient
      .request(getTxsByAddressPagination, {
        expression,
        offset,
        pageSize,
        isWasm: wasmEnable,
        isMove: moveEnable,
      })
      .then<Transaction[]>(({ account_transactions }) =>
        account_transactions.map<Transaction>((transaction) => ({
          hash: parseTxHash(transaction.transaction.hash),
          messages: snakeToCamel(transaction.transaction.messages),
          sender: transaction.transaction.account.address as Addr,
          isSigner: transaction.is_signer,
          height: transaction.block.height,
          created: parseDate(transaction.block.timestamp),
          success: transaction.transaction.success,
          actionMsgType: getActionMsgType([
            transaction.transaction.is_send,
            transaction.transaction.is_execute,
            transaction.transaction.is_instantiate,
            transaction.transaction.is_store_code,
            transaction.transaction.is_migrate,
            transaction.transaction.is_update_admin,
            transaction.transaction.is_clear_admin,
            // TODO: handle more action Move msg type
          ]),
          furtherAction: getMsgFurtherAction(
            transaction.transaction.messages.length,
            {
              isSend: transaction.transaction.is_send,
              isIbc: transaction.transaction.is_ibc,
              isExecute: transaction.transaction.is_execute,
              isInstantiate: transaction.transaction.is_instantiate,
              isUpload: transaction.transaction.is_store_code,
              isMigrate: transaction.transaction.is_migrate,
              isUpdateAdmin: transaction.transaction.is_update_admin,
              isClearAdmin: transaction.transaction.is_clear_admin,
              isMovePublish: transaction.transaction.is_move_publish,
              isMoveUpgrade: transaction.transaction.is_move_upgrade,
              isMoveExecute: transaction.transaction.is_move_execute,
              isMoveScript: transaction.transaction.is_move_script,
            },
            transaction.transaction.success,
            transaction.is_signer
          ),
          isIbc: transaction.transaction.is_ibc,
          isOpinit: transaction.transaction.is_opinit,
          isInstantiate: transaction.transaction.is_instantiate ?? false,
        }))
      );
  }, [
    accountId,
    expression,
    indexerGraphClient,
    moveEnable,
    offset,
    pageSize,
    wasmEnable,
  ]);
  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_PAGINATION,
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
      enabled: accountId !== undefined,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxsCountByAddress = ({
  accountId,
  search,
  filters,
  isSigner,
}: {
  accountId: Option<Nullable<number>>;
  search: string;
  filters: TxFilters;
  isSigner: Option<boolean>;
}): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = useTxExpression({
    accountId,
    search,
    filters,
    isSigner,
  });

  const queryFn = useCallback(async () => {
    if (!accountId) return 0;
    return indexerGraphClient
      .request(getTxsCountByAddress, {
        expression,
      })
      .then(
        ({ account_transactions_aggregate }) =>
          account_transactions_aggregate.aggregate?.count
      );
  }, [accountId, expression, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_COUNT,
      accountId,
      search,
      filters,
      isSigner,
      indexerGraphClient,
    ],
    queryFn,
    {
      enabled: accountId !== undefined,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxsByPoolIdPagination = (
  poolId: number,
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
        pool_transactions.map<Transaction>((transaction) => ({
          hash: parseTxHash(transaction.transaction.hash),
          // TODO: revisit this
          messages: snakeToCamel(transaction.transaction.messages) as Message[],
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
      CELATONE_QUERY_KEYS.POOL_TRANSACTION_BY_ID,
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
  poolId: number,
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
    [
      CELATONE_QUERY_KEYS.POOL_TRANSACTION_BY_ID_COUNT,
      poolId,
      type,
      indexerGraphClient,
    ],
    createQueryFnWithTimeout(queryFn, 5000),
    {
      enabled: !!poolId,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxs = (
  limit: number,
  offset: number,
  options: Pick<
    UseQueryOptions<TxsResponse, Error>,
    "onSuccess" | "onError"
  > = {}
): UseQueryResult<TxsResponse> => {
  const endpoint = useBaseApiRoute("txs");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.TXS, endpoint, limit, offset, wasmEnable, moveEnable],
    async () => getTxs(endpoint, limit, offset, wasmEnable, moveEnable),
    { ...options, retry: 1, refetchOnWindowFocus: false }
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

  return useQuery([CELATONE_QUERY_KEYS.TXS_COUNT, indexerGraphClient], queryFn);
};

export const useTxsByBlockHeightPagination = (
  height: number,
  limit: number,
  offset: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getBlockTransactionsByHeightQueryDocument, {
          limit,
          offset,
          height,
          isWasm: wasmEnable,
          isMove: moveEnable,
        })
        .then<Transaction[]>(({ transactions }) =>
          transactions.map<Transaction>((transaction) => ({
            hash: parseTxHash(transaction.hash),
            messages: snakeToCamel(transaction.messages),
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
            isInstantiate: transaction.is_instantiate ?? false,
          }))
        ),
    [height, limit, offset, indexerGraphClient, wasmEnable, moveEnable]
  );

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_BY_BLOCK_HEIGHT_PAGINATION,
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
    [CELATONE_QUERY_KEYS.TXS_BY_BLOCK_HEIGHT_COUNT, indexerGraphClient, height],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!height,
    }
  );
};

export const useModuleTxsByPagination = ({
  moduleId,
  pageSize,
  offset,
}: {
  moduleId: Option<Nullable<number>>;
  pageSize: number;
  offset: number;
}) => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = async () => {
    if (!moduleId) return [];
    return indexerGraphClient
      .request(getModuleTransactionsQueryDocument, {
        moduleId,
        pageSize,
        offset,
      })
      .then<Transaction[]>(({ module_transactions }) =>
        module_transactions.map<Transaction>((transaction) => ({
          hash: parseTxHash(transaction.transaction.hash),
          messages: snakeToCamel(transaction.transaction.messages),
          sender: transaction.transaction.account.address as HumanAddr,
          height: transaction.block.height,
          created: parseDate(transaction.block.timestamp),
          success: transaction.transaction.success,
          actionMsgType: getActionMsgType([
            transaction.transaction.is_send,
            // TODO: handle more action Move msg type
          ]),
          furtherAction: MsgFurtherAction.NONE,
          isSigner: false,
          isIbc: transaction.transaction.is_ibc,
          isInstantiate: false,
        }))
      );
  };

  return useQuery(
    [
      CELATONE_QUERY_KEYS.MODULE_TXS,
      indexerGraphClient,
      moduleId,
      pageSize,
      offset,
    ],
    createQueryFnWithTimeout(queryFn),
    {
      enabled: Boolean(moduleId),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useModuleTxsCount = (moduleId: Option<Nullable<number>>) => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = async () => {
    if (!moduleId) throw new Error("Module id not found");
    return indexerGraphClient
      .request(getModuleTransactionsCountQueryDocument, {
        moduleId,
      })
      .then(
        ({ module_transactions_aggregate }) =>
          module_transactions_aggregate.aggregate?.count
      );
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.MODULE_TXS_COUNT, indexerGraphClient, moduleId],
    queryFn,
    {
      enabled: Boolean(moduleId),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};
