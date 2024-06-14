import axios from "axios";

import { zAccountData, zAccountTableCounts } from "../types";
import type { AccountData, AccountTableCounts } from "../types";
import type { BechAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getAccountData = async (
  endpoint: string,
  address: BechAddr
): Promise<AccountData> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/info`)
    .then(({ data }) => parseWithError(zAccountData, data));

export const getAccountTableCounts = async (
  endpoint: string,
  address: string,
  isGov: boolean,
  isWasm: boolean
): Promise<AccountTableCounts> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/table-counts`, {
      params: {
        is_gov: isGov,
        is_wasm: isWasm,
      },
    })
    .then(({ data }) => parseWithError(zAccountTableCounts, data));
