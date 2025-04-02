import axios from "axios";
import { parseWithError } from "lib/utils";

import type { OverviewsStats } from "../types";

import { zOverviewsStatsResponse } from "../types";

export const getOverviewsStats = async (
  endpoint: string
): Promise<OverviewsStats> =>
  axios
    .get(`${endpoint}/stats`)
    .then(({ data }) => parseWithError(zOverviewsStatsResponse, data));
