import type { Coin } from "@cosmjs/stargate";
import axios from "axios";

import type { BechAddr } from "lib/types";
import { parseWithError } from "lib/utils";
import { zBalancesResponse } from "../types";

export const getBalances = async (
  endpoint: string,
  address: BechAddr
): Promise<Coin[]> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/balances`)
    .then(({ data }) => parseWithError(zBalancesResponse, data));
