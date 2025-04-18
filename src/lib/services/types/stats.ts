import { z } from "zod";

export const zOverviewsStatsResponse = z
  .object({
    block_time: z.number().nonnegative().nullable(),
    latest_block: z.number().nonnegative().nullable(),
    transaction_count: z.number().nonnegative().nullable(),
  })
  .transform((val) => ({
    blockTime: val.block_time,
    latestBlock: val.latest_block,
    txCount: val.transaction_count,
  }));

export type OverviewsStats = z.infer<typeof zOverviewsStatsResponse>;

export const zOverviewsStatsResponseSequencer = z
  .object({
    data: z.array(
      z.object({
        active_accounts: z.number().nonnegative(),
        date: z.string(),
        tvl: z.number().nonnegative(),
        tx_count: z.number().nonnegative(),
      })
    ),
    last_block_height: z.number().nonnegative(),
  })
  .transform<OverviewsStats>((val) => ({
    blockTime: null,
    latestBlock: val.last_block_height,
    txCount: val.data[val.data.length - 1].tx_count,
  }));
