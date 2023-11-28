import axios from "axios";
import { z } from "zod";

import type { HexAddr } from "lib/types";

const PoolRawCoinSchema = z.object({
  metadata: z.string(),
  denom: z.string(),
  decimals: z.number().nonnegative(),
});
const PairRawSchema = z.object({
  coin_a: PoolRawCoinSchema,
  coin_b: PoolRawCoinSchema,
  liquidity_token: PoolRawCoinSchema,
  coin_a_weight: z.string(),
  coin_b_weight: z.string(),
  coin_a_amount: z.string(),
  coin_b_amount: z.string(),
  total_share: z.string(),
});

interface PairResponse {
  coin_a: {
    metadata: HexAddr;
    denom: string;
    precision: number;
    weight: string;
    amount: string;
  };
  coin_b: {
    metadata: HexAddr;
    denom: string;
    precision: number;
    weight: string;
    amount: string;
  };
  lp_denom: string;
  lp_metadata: HexAddr;
  precision: number;
  total_share: string;
}

export const getMovePoolInfos = async (
  endpoint: string
): Promise<PairResponse[]> =>
  axios.get(`${endpoint}/pools`).then((res) =>
    z
      .array(PairRawSchema)
      .parse(res.data)
      .map<PairResponse>((pair) => ({
        coin_a: {
          metadata: pair.coin_a.metadata as HexAddr,
          denom: pair.coin_a.denom,
          precision: pair.coin_a.decimals,
          weight: pair.coin_a_weight,
          amount: pair.coin_a_amount,
        },
        coin_b: {
          denom: pair.coin_b.denom,
          metadata: pair.coin_b.metadata as HexAddr,
          precision: pair.coin_b.decimals,
          weight: pair.coin_b_weight,
          amount: pair.coin_b_amount,
        },
        lp_denom: pair.liquidity_token.denom,
        lp_metadata: pair.liquidity_token.metadata as HexAddr,
        precision: pair.liquidity_token.decimals,
        total_share: pair.total_share,
      }))
  );
