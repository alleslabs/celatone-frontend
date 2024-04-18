import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import { z } from "zod";

import type { BechAddr } from "lib/types";
import { parseWithError } from "lib/utils";

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
  address: BechAddr
): Promise<Coin[]> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/balances`)
    .then(({ data }) => parseWithError(zBalancesResponse, data));
