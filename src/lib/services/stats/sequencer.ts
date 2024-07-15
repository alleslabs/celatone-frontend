import axios from "axios";

import { getBlocksSequencer } from "../block/sequencer";
import type { OverviewsStats } from "../types";
import { zOverviewsStatsResponseSequencer } from "../types";
import { parseWithError } from "lib/utils";

export const getOverviewStatsSequencer = async (
  endpoint: string,
  chainId: string
): Promise<OverviewsStats> =>
  Promise.allSettled([
    axios
      .get(
        `https://dashboard-api.initiation-1.initia.xyz/v1/chart-data/${chainId}`
      )
      .then(({ data }) => data),
    getBlocksSequencer(endpoint, undefined, 1),
    axios
      .get(`${endpoint}/indexer/block/v1/avg_blocktime`)
      .then(({ data }) => data),
  ]).then(([dashboardApi, blocksLcd, avgBlockTimeLcd]) => {
    const data = parseWithError(zOverviewsStatsResponseSequencer, [
      dashboardApi.status === "fulfilled" ? dashboardApi.value : null,
      avgBlockTimeLcd.status === "fulfilled" ? avgBlockTimeLcd.value : null,
    ]);

    return {
      ...data,
      latestBlock:
        blocksLcd.status === "fulfilled"
          ? blocksLcd.value.blocks[0].height
          : null,
    };
  });
