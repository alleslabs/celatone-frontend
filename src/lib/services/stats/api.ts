import axios from "axios";

import { parseWithError } from "lib/utils";
import { zOverviewsStatsResponse } from "../types";
import type { OverviewsStats } from "../types";

export const getOverviewsStats = async (
  endpoint: string
): Promise<OverviewsStats> =>
  axios
    .get(`${endpoint}/stats`)
    .then(({ data }) => parseWithError(zOverviewsStatsResponse, data));
