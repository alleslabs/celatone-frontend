import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import type { OverviewsStats } from "../types";
import { handleQueryByTier } from "../utils";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
  useLcdEndpoint,
  useTierConfig,
} from "lib/app-provider";

import { getOverviewsStats } from "./api";
import { getOverviewStatsSequencer } from "./sequencer";

/**
 * Fetches the overviews stats from the source based on the tier.
 * Supports only "full" and "sequencer" tiers.
 *
 * @param {boolean} [enabled=true] - Whether the query should be enabled.
 */
export const useOverviewsStats = (
  enabled: boolean = true
): UseQueryResult<OverviewsStats> => {
  const { tier } = useTierConfig();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  const apiEndpoint = useBaseApiRoute("overviews");
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.OVERVIEWS_STATS,
      apiEndpoint,
      lcdEndpoint,
      chainId,
      tier,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        querySequencer: () => getOverviewStatsSequencer(lcdEndpoint, chainId),
        queryFull: () => getOverviewsStats(apiEndpoint),
      }),
    {
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};
