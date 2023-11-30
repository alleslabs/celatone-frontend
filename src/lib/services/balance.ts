import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import { z } from "zod";

import type { Addr } from "lib/types";

const BalancesResponseSchema = z
  .array(
    z.object({
      amount: z.string(),
      denom: z.string(),
    })
  )
  .transform<Coin[]>((balances) => balances);

export const getBalances = async (
  endpoint: string,
  address: Addr
): Promise<Coin[]> =>
  axios
    .get(`${endpoint}/${address}`)
    .then((res) => BalancesResponseSchema.parse(res.data));
