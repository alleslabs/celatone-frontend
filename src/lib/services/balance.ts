import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import { z } from "zod";

import type { Addr } from "lib/types";

const zBalancesResponse = z
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
    .get(`${endpoint}/${encodeURIComponent(address)}`)
    .then((res) => zBalancesResponse.parse(res.data));
