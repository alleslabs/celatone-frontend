import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { getPoolByPoolId, getPoolList, getPoolListCount } from "lib/query";
import type { Pool, PoolDetail } from "lib/types";

import { usePoolExpression } from "./expression/poolExpression";

export const usePoolListByIsSupported = (
  isSupported: boolean,
  isSuperfluidOnly: boolean,
  search: string,
  offset: number,
  pageSize: number
): UseQueryResult<Pool[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = usePoolExpression(isSupported, isSuperfluidOnly, search);

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getPoolList, {
        expression,
        offset,
        pageSize,
      })
      .then(({ pools }) =>
        pools.map((pool) => ({
          id: pool.id,
          type: pool.type,
          isSuperfluid: pool.is_superfluid,
          poolLiquidity: pool.liquidity,
        }))
      );
  }, [expression, indexerGraphClient, offset, pageSize]);

  return useQuery(
    [
      "pool_list_by_is_supported",
      isSupported,
      isSuperfluidOnly,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn
  );
};

export const usePoolListCountByIsSupported = (
  isSupported: boolean,
  isSuperfluidOnly: boolean,
  search: string
): UseQueryResult<number> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = usePoolExpression(isSupported, isSuperfluidOnly, search);

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getPoolListCount, {
        expression,
      })
      .then(({ pools_aggregate }) => pools_aggregate.aggregate?.count);
  }, [expression, indexerGraphClient]);

  return useQuery(
    [
      "pool_list_count_by_is_supported",
      isSupported,
      isSuperfluidOnly,
      search,
      indexerGraphClient,
    ],
    queryFn
  );
};

export const usePoolByPoolId = (poolId: number): UseQueryResult<PoolDetail> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
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
            } as PoolDetail)
          : undefined
      );
  }, [poolId, indexerGraphClient]);

  return useQuery(["pool_by_pool_id", poolId, indexerGraphClient], queryFn);
};
