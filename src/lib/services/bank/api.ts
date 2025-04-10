import type { Coin } from "@cosmjs/stargate";
import type { BechAddr } from "lib/types";

import axios from "axios";
import { parseWithError } from "lib/utils";

import { zBalancesResponse } from "../types";

export const getBalances = async (
  endpoint: string,
  address: BechAddr
): Promise<Coin[]> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/balances`)
    .then(({ data }) => parseWithError(zBalancesResponse, data));
