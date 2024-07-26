import axios from "axios";

import { zOverviewsStatsResponse } from "../types";
import type { OverviewsStats } from "../types";
import { parseWithError } from "lib/utils";

export const getOverviewsStats = async (
  endpoint: string
): Promise<OverviewsStats> =>
  axios
    .get(`${endpoint}/stats`)
    .then(({ data }) => parseWithError(zOverviewsStatsResponse, data));
