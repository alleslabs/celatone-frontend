import type { Coin } from "@cosmjs/stargate";
import axios from "axios";

import { zBalancesResponse } from "../types";
import type { BechAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getBalances = async (
  endpoint: string,
  address: BechAddr
): Promise<Coin[]> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/balances`)
    .then(({ data }) => parseWithError(zBalancesResponse, data));
