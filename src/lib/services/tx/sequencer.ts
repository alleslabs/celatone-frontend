import axios from "axios";

import { zTxsByAddressResponseSequencer } from "../types";
import type { BechAddr20 } from "lib/types";
import { parseWithError } from "lib/utils";

export const getTxsByAccountAddressSequencer = async (
  endpoint: string,
  address: BechAddr20,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/indexer/tx/v1/txs/by_account/${encodeURIComponent(address)}`,
      {
        params: {
          "pagination.limit": limit,
          "pagination.offset": offset,
          "pagination.count_total": true,
          "pagination.reverse": true,
        },
      }
    )
    .then(({ data }) => parseWithError(zTxsByAddressResponseSequencer, data));
