import type { PoolTypeFilter } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";

import { getPoolData, getPools, getPoolsLiquidityByPoolIds } from "./api";

export const usePools = (
  limit: number,
  offset: number,
  isSupported: boolean,
  type: PoolTypeFilter,
  isSuperfluidOnly: boolean,
  search: string,
  isDesc: boolean
) => {
  const endpoint = useBaseApiRoute("pools");
  return useQuery({
    queryFn: async () =>
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
    queryKey: [
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
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const usePoolData = (id: number, enabled = true) => {
  const endpoint = useBaseApiRoute("pools");

  return useQuery({
    enabled,
    queryFn: async () => getPoolData(endpoint, id),
    queryKey: [CELATONE_QUERY_KEYS.POOL_DATA, endpoint, id],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const usePoolsLiquidityByPoolIds = (
  poolIds: number[],
  enabled = true
) => {
  const endpoint = useBaseApiRoute("pools");

  return useQuery({
    enabled,
    queryFn: async () =>
      getPoolsLiquidityByPoolIds(endpoint, poolIds).then(({ items }) =>
        items.reduce<Record<number, string[]>>(
          (prev, item) => ({
            ...prev,
            [item.id]: item.liquidity.map((liquidity) => liquidity.denom),
          }),
          {}
        )
      ),
    queryKey: [CELATONE_QUERY_KEYS.POOLS_LIQUIDITY_BY_IDS, endpoint, poolIds],
    refetchOnWindowFocus: false,
    retry: false,
  });
};
