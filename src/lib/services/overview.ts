import axios from "axios";
import { z } from "zod";

import { parseWithError } from "lib/utils";

const zOverviewsStatsResponse = z
  .object({
    transaction_count: z.number().nonnegative(),
    latest_block: z.number().nonnegative(),
    block_time: z.number().nonnegative(),
  })
  .transform((val) => ({
    txCount: val.transaction_count,
    latestBlock: val.latest_block,
    blockTime: val.block_time,
  }));

export type OverviewsStats = z.infer<typeof zOverviewsStatsResponse>;

export const getOverviewsStats = async (
  endpoint: string
): Promise<OverviewsStats> =>
  axios
    .get(`${endpoint}/stats`)
    .then(({ data }) => parseWithError(zOverviewsStatsResponse, data));
