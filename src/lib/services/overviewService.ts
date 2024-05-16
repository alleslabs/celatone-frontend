import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";

import { getOverviewsStats } from "./overview";
import type { OverviewsStats } from "./overview";

export const useOverviewsStats = (
  enabled: boolean = true
): UseQueryResult<OverviewsStats> => {
  const endpoint = useBaseApiRoute("overviews");

  return useQuery(
    [CELATONE_QUERY_KEYS.OVERVIEWS_STATS, endpoint],
    async () => getOverviewsStats(endpoint),
    {
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};
