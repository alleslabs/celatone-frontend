import axios from "axios";

import {
  zTxsByAddressResponseSequencer,
  zTxsByHashResponseSequencer,
} from "../types";
import type { BechAddr20, Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getTxsByAccountAddressSequencer = async (
  endpoint: string,
  address: BechAddr20,
  paginationKey: Option<string>
) =>
  axios
    .get(`${endpoint}/indexer/tx/v1/txs/by_account/${encodeURI(address)}`, {
      params: {
        "pagination.limit": 10,
        "pagination.reverse": true,
        "pagination.key": paginationKey,
      },
    })
    .then(({ data }) => parseWithError(zTxsByAddressResponseSequencer, data));

export const getTxsByHashSequencer = async (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/indexer/tx/v1/txs/${encodeURI(txHash)}`)
    .then(({ data }) => parseWithError(zTxsByHashResponseSequencer, data));
