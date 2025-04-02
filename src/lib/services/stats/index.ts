import type { UseQueryResult } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";

import type { OverviewsStats } from "../types";

import { getOverviewsStats } from "./api";

/**
 * Fetches the overviews stats from the source based on the tier.
 * Supports only "full" and "sequencer" tiers.
 *
 * @param {boolean} [enabled=true] - Whether the query should be enabled.
 */
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
