import type { UseQueryOptions } from "@tanstack/react-query";
import type { PoolTypeFilter } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";

import type { PoolsResponse } from "../types";

import { getPoolData, getPools, getPoolsLiquidityByPoolIds } from "./api";

export const usePools = (
  limit: number,
  offset: number,
  isSupported: boolean,
  type: PoolTypeFilter,
  isSuperfluidOnly: boolean,
  search: string,
  isDesc: boolean,
  options: Pick<UseQueryOptions<PoolsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("pools");
  return useQuery(
    [
      CELATONE_QUERY_KEYS.POOLS,
      endpoint,
      limit,
      offset,
      isSupported,
      type,
      isSuperfluidOnly,
      search,
      isDesc,
    ],
    async () =>
      getPools(
        endpoint,
        limit,
        offset,
        isSupported,
        type,
        isSuperfluidOnly,
        search,
        isDesc
      ),
    {
      refetchOnWindowFocus: false,
      retry: false,
      ...options,
    }
  );
};

export const usePoolData = (id: number, enabled = true) => {
  const endpoint = useBaseApiRoute("pools");

  return useQuery(
    [CELATONE_QUERY_KEYS.POOL_DATA, endpoint, id],
    async () => getPoolData(endpoint, id),
    { enabled, refetchOnWindowFocus: false, retry: false }
  );
};

export const usePoolsLiquidityByPoolIds = (
  poolIds: number[],
  enabled = true
) => {
  const endpoint = useBaseApiRoute("pools");

  return useQuery(
    [CELATONE_QUERY_KEYS.POOLS_LIQUIDITY_BY_IDS, endpoint, poolIds],
    () =>
      getPoolsLiquidityByPoolIds(endpoint, poolIds).then(({ items }) =>
        items.reduce<Record<number, string[]>>(
          (prev, item) => ({
            ...prev,
            [item.id]: item.liquidity.map((liquidity) => liquidity.denom),
          }),
          {}
        )
      ),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
};
