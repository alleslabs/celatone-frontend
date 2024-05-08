import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import { getTxsByPoolIdPagination, getTxsCountByPoolId } from "lib/query";
import { createQueryFnWithTimeout } from "lib/query-utils";
import { usePoolTxExpression } from "lib/services/expression";
import type {
  BechAddr,
  Message,
  Option,
  PoolTxFilter,
  Transaction,
} from "lib/types";
import { ActionMsgType, MsgFurtherAction } from "lib/types";
import { parseDate, parseTxHash, snakeToCamel } from "lib/utils";

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
