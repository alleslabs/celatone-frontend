import axios from "axios";
import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";
import { z } from "zod";

const zPairResponseCoin = z.object({
  decimals: z.number().nonnegative(),
  denom: z.string(),
  metadata: zHexAddr,
});
const zPairResponse = z
  .object({
    coin_a: zPairResponseCoin,
    coin_a_amount: z.string(),
    coin_a_weight: z.string(),
    coin_b: zPairResponseCoin,
    coin_b_amount: z.string(),
    coin_b_weight: z.string(),
    liquidity_token: zPairResponseCoin,
    total_share: z.string(),
  })
  .transform((val) => ({
    coin_a: {
      amount: val.coin_a_amount,
      denom: val.coin_a.denom,
      metadata: val.coin_a.metadata,
      precision: val.coin_a.decimals,
      weight: val.coin_a_weight,
    },
    coin_b: {
      amount: val.coin_b_amount,
      denom: val.coin_b.denom,
      metadata: val.coin_b.metadata,
      precision: val.coin_b.decimals,
      weight: val.coin_b_weight,
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
