import axios from "axios";
import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";
import { z } from "zod";

const zPairResponseCoin = z.object({
  metadata: zHexAddr,
  denom: z.string(),
  decimals: z.number().nonnegative(),
});
const zPairResponse = z
  .object({
    coin_a: zPairResponseCoin,
    coin_b: zPairResponseCoin,
    liquidity_token: zPairResponseCoin,
    coin_a_weight: z.string(),
    coin_b_weight: z.string(),
    coin_a_amount: z.string(),
    coin_b_amount: z.string(),
    total_share: z.string(),
  })
  .transform((val) => ({
    coin_a: {
      metadata: val.coin_a.metadata,
      denom: val.coin_a.denom,
      precision: val.coin_a.decimals,
      weight: val.coin_a_weight,
      amount: val.coin_a_amount,
    },
    coin_b: {
      denom: val.coin_b.denom,
      metadata: val.coin_b.metadata,
      precision: val.coin_b.decimals,
      weight: val.coin_b_weight,
      amount: val.coin_b_amount,
    },
    lp_denom: val.liquidity_token.denom,
    lp_metadata: val.liquidity_token.metadata,
    precision: val.liquidity_token.decimals,
    total_share: val.total_share,
  }));

export const getMovePoolInfos = async (endpoint: string) =>
  axios
    .get(`${endpoint}/pools`)
    .then(({ data }) => parseWithError(z.array(zPairResponse), data));
