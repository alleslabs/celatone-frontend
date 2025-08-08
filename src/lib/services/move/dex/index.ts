import { useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS } from "lib/app-provider";

import { getMoveDexPoolsInfo } from "./api";

export const useMoveDexPoolInfo = (lp: string) =>
  useQuery({
    queryFn: () => getMoveDexPoolsInfo(),
    queryKey: [CELATONE_QUERY_KEYS.MOVE_DEX_POOLS_INFO],
    refetchOnWindowFocus: false,
    retry: 1,
    select: (data) => data.pools.find((pool) => pool.lp === lp),
  });
