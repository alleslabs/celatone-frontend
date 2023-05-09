import type { Coin } from "@cosmjs/stargate";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import type { Order_By } from "lib/gql/graphql";
import {
  getPoolByPoolId,
  getPoolList,
  getPoolListByDenoms,
  getPoolListByDenomsCount,
  getPoolListCount,
  getPoolsByPoolIds,
} from "lib/query";
import type { Option, Pool, PoolDetail, PoolTypeFilter } from "lib/types";
import { isPositiveInt } from "lib/utils";

import { usePoolExpression } from "./expression/poolExpression";

export const usePoolListQuery = ({
  isSupported,
  poolType,
  isSuperfluidOnly,
  search,
  order,
  offset,
  pageSize,
}: {
  isSupported: boolean;
  poolType: PoolTypeFilter;
  isSuperfluidOnly: boolean;
  search: string;
  order: Order_By;
  offset: number;
  pageSize: number;
}): UseQueryResult<Pool<Coin>[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = usePoolExpression(
    isSupported,
    poolType,
    isSuperfluidOnly,
    search
  );

  const queryFn = useCallback(async () => {
    const request =
      !search || isPositiveInt(search)
        ? indexerGraphClient.request(getPoolList, {
            expression,
            order,
            offset,
            pageSize,
          })
        : indexerGraphClient.request(getPoolListByDenoms, {
            denoms: search,
            expression,
            order,
            offset,
            pageSize,
          });
    return request.then(({ pools }) =>
      pools.map<Pool<Coin>>((pool) => ({
        id: pool.id,
        type: pool.type,
        isSuperfluid: pool.is_superfluid,
        poolLiquidity: pool.liquidity,
      }))
    );
  }, [expression, indexerGraphClient, offset, order, pageSize, search]);

  return useQuery(
    [
      "pool_list_query",
      isSupported,
      poolType,
      isSuperfluidOnly,
      search,
      order,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn
  );
};

export const usePoolListCountQuery = ({
  isSupported,
  poolType,
  isSuperfluidOnly,
  search,
}: {
  isSupported: boolean;
  poolType: PoolTypeFilter;
  isSuperfluidOnly: boolean;
  search: string;
}): UseQueryResult<number> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = usePoolExpression(
    isSupported,
    poolType,
    isSuperfluidOnly,
    search
  );

  const queryFn = useCallback(async () => {
    const request =
      !search || isPositiveInt(search)
        ? indexerGraphClient.request(getPoolListCount, {
            expression,
          })
        : indexerGraphClient.request(getPoolListByDenomsCount, {
            denoms: search,
            expression,
          });

    return request.then(
      ({ pools_aggregate }) => pools_aggregate.aggregate?.count
    );
  }, [expression, indexerGraphClient, search]);

  return useQuery(
    [
      "pool_list_count_query",
      isSupported,
      poolType,
      isSuperfluidOnly,
      search,
      indexerGraphClient,
    ],
    queryFn
  );
};

export const usePoolByPoolId = (
  poolId: Option<number>
): UseQueryResult<PoolDetail<string, Coin>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!poolId) throw new Error("Pool ID not found (usePoolByPoolId)");

    return indexerGraphClient
      .request(getPoolByPoolId, {
        poolId,
      })
      .then(({ pools_by_pk }) =>
        pools_by_pk
          ? ({
              id: pools_by_pk.id,
              type: pools_by_pk.type,
              isSuperfluid: pools_by_pk.is_superfluid,
              isSupported: pools_by_pk.is_supported,
              poolLiquidity: pools_by_pk.liquidity,
              blockHeight: pools_by_pk.transaction?.block_height,
              creator: pools_by_pk.account?.address,
              poolAddress: pools_by_pk.address,
              swapFee: Number(pools_by_pk.swap_fee),
              exitFee: Number(pools_by_pk.exit_fee),
              futurePoolGovernor: pools_by_pk.future_pool_governor,
              weight: pools_by_pk.weight,
              smoothWeightChangeParams: pools_by_pk.smooth_weight_change_params,
              scalingFactors: pools_by_pk.scaling_factors,
              scalingFactorController: pools_by_pk.scaling_factor_controller,
            } as PoolDetail<string, Coin>)
          : undefined
      );
  }, [poolId, indexerGraphClient]);

  return useQuery(["pool_by_pool_id", poolId, indexerGraphClient], queryFn, {
    enabled: !!poolId,
  });
};

export const usePoolAssetsbyPoolIds = (
  poolIds: number[],
  enabled = true
): UseQueryResult<Record<number, string[]>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getPoolsByPoolIds, {
        poolIds,
      })
      .then(({ pools }) =>
        pools.reduce(
          (prev, pool) => ({
            ...prev,
            [pool.id]: (pool.liquidity as Coin[]).map(
              (liquidity) => liquidity.denom
            ),
          }),
          {} as Record<number, string[]>
        )
      );
  }, [poolIds, indexerGraphClient]);

  return useQuery(["pools_by_pool_ids", poolIds, indexerGraphClient], queryFn, {
    enabled,
  });
};
