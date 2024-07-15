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
  .tuple([
    z
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
      .nullable(),
    z
      .object({
        avg_block_time: z.number().nonnegative(),
      })
      .nullable(),
  ])
  .transform<OverviewsStats>(([stat, avg]) => ({
    latestBlock: stat?.last_block_height ?? null,
    txCount:
      stat?.data.sort((a, b) => b.date.localeCompare(a.date))[0].tx_count ??
      null,
    blockTime: avg?.avg_block_time ?? null,
  }));
