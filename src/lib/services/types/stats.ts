import { z } from "zod";

export const zOverviewsStatsResponse = z
  .object({
    transaction_count: z.number().nonnegative().nullable(),
    latest_block: z.number().nonnegative().nullable(),
    block_time: z.number().nonnegative().nullable(),
  })
  .transform((val) => ({
    txCount: val.transaction_count,
    latestBlock: val.latest_block,
    blockTime: val.block_time,
  }));

export type OverviewsStats = z.infer<typeof zOverviewsStatsResponse>;

export const zOverviewsStatsResponseSequencer = z
  .object({
    last_block_height: z.number().nonnegative(),
    data: z.array(
      z.object({
        date: z.string(),
        tvl: z.number().nonnegative(),
        tx_count: z.number().nonnegative(),
        active_accounts: z.number().nonnegative(),
      })
    ),
  })
  .transform<OverviewsStats>((val) => ({
    txCount: val.data[val.data.length - 1].tx_count,
    latestBlock: val.last_block_height,
    blockTime: null,
  }));
