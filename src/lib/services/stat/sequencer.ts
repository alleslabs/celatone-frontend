import axios from "axios";

import type { OverviewsStats } from "../types";
import { zOverviewsStatsResponseSequencer } from "../types";
import { parseWithError } from "lib/utils";

export const getOverviewStatsSequencer = async (
  endpoint: string,
  chainId: string
): Promise<OverviewsStats> => {
  return Promise.all([
    axios
      .get(
        `https://dashboard-api.initiation-1.initia.xyz/v1/chart-data/${chainId}`
      )
      .then(({ data }) => data),
    axios
      .get(`${endpoint}/indexer/block/v1/avg_blocktime`)
      .then(({ data }) => data),
  ]).then((data) => parseWithError(zOverviewsStatsResponseSequencer, data));
};
