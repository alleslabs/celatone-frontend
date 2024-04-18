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
  useInitia,
  useMoveConfig,
  useWasmConfig,
} from "lib/app-provider";
import {
  getModuleTransactionsCountQueryDocument,
  getTxsByPoolIdPagination,
  getTxsCountByPoolId,
} from "lib/query";
import { createQueryFnWithTimeout } from "lib/query-utils";
import type {
  BechAddr,
  HexAddr,
  Message,
  Nullable,
  Option,
  PoolTxFilter,
  Transaction,
  TxFilters,
} from "lib/types";
import { ActionMsgType, MsgFurtherAction } from "lib/types";
import {
  extractTxLogs,
  isTxHash,
  parseDate,
  parseTxHash,
  snakeToCamel,
} from "lib/utils";

import { usePoolTxExpression } from "./expression";
import type {
  AccountTxsResponse,
  BlockTxsResponse,
  ModuleTxsResponse,
  TxResponse,
  TxsResponse,
} from "./tx";
import {
  getTxs,
  getTxsByAddress,
  getTxsByBlockHeight,
  getTxsByModule,
  getTxsCountByAddress,
  queryTxData,
} from "./tx";

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
      const logs = extractTxLogs(txData);
      return {
        ...txData,
        logs,
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

export const useTxsByAddress = (
  address: Option<BechAddr>,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  offset: number,
  limit: number
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });
  const { enabled: isMove } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<AccountTxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS,
      endpoint,
      address,
      search,
      isSigner,
      JSON.stringify(txFilters),
      limit,
      offset,
      isWasm,
      isMove,
    ],
    async () => {
      if (!address) throw new Error("No user address");
      return getTxsByAddress(
        endpoint,
        address,
        search,
        isSigner,
        txFilters,
        limit,
        offset,
        isWasm,
        isMove,
        isInitia
      );
    },
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsCountByAddress = (
  address: Option<BechAddr>,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_COUNT_BY_ADDRESS,
      endpoint,
      address,
      search,
      isSigner,
      JSON.stringify(txFilters),
    ],
    async () => {
      if (!address) throw new Error("address is undefined");
      return getTxsCountByAddress(
        endpoint,
        address,
        search,
        isSigner,
        txFilters,
        wasmEnable
      );
    },
    { retry: 1, refetchOnWindowFocus: false }
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
          sender: transaction.transaction.account.address as BechAddr,
          isSigner: true,
          height: transaction.block.height,
          created: parseDate(transaction.block.timestamp),
          success: transaction.transaction.success,
          actionMsgType: ActionMsgType.OTHER_ACTION_MSG,
          furtherAction: MsgFurtherAction.NONE,
          isIbc: transaction.transaction.is_ibc,
          isInstantiate: false,
          isOpinit: false,
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
  options: Pick<UseQueryOptions<TxsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("txs");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<TxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS,
      endpoint,
      limit,
      offset,
      wasmEnable,
      moveEnable,
      isInitia,
    ],
    async () =>
      getTxs(endpoint, limit, offset, wasmEnable, moveEnable, isInitia),
    { ...options, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsByBlockHeight = (
  height: number,
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<BlockTxsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("blocks");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<BlockTxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_BLOCK_HEIGHT,
      endpoint,
      limit,
      offset,
      height,
      wasmEnable,
      moveEnable,
      isInitia,
    ],
    async () =>
      getTxsByBlockHeight(
        endpoint,
        height,
        limit,
        offset,
        wasmEnable,
        moveEnable,
        isInitia
      ),
    {
      ...options,
      keepPreviousData: true,
      enabled: !!height,
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

export const useTxsByModule = (
  address: HexAddr,
  moduleName: string,
  offset: number,
  limit: number
) => {
  const endpoint = useBaseApiRoute("move");
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });
  const { enabled: isMove } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<ModuleTxsResponse>(
    [
      CELATONE_QUERY_KEYS.MODULE_TXS,
      endpoint,
      address,
      moduleName,
      limit,
      offset,
      isWasm,
      isMove,
    ],
    async () =>
      getTxsByModule(
        endpoint,
        address,
        moduleName,
        limit,
        offset,
        isWasm,
        isMove,
        isInitia
      ),
    { retry: 1, refetchOnWindowFocus: false }
  );
};
