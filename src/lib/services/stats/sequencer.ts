import axios from "axios";

import { zOverviewsStatsResponseSequencer } from "../types";
import { parseWithError } from "lib/utils";

export const getOverviewStatsSequencer = async (chainId: string) =>
  axios
    .get(
      `https://dashboard-api.initiation-1.initia.xyz/v1/chart-data/${chainId}`
    )
    .then(({ data }) => parseWithError(zOverviewsStatsResponseSequencer, data));
