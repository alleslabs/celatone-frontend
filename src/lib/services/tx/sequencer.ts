import axios from "axios";

import { zBlockTxsResponseSequencer } from "../types";
import type { Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getTxsByBlockHeightSequencer = async (
  endpoint: string,
  height: number,
  paginationKey: Option<string>
) =>
  axios
    .get(
      `${endpoint}/indexer/tx/v1/txs/by_height/${encodeURIComponent(height)}`,
      {
        params: {
          "pagination.offset": 0,
          "pagination.limit": 10,
          "pagination.key": paginationKey,
        },
      }
    )
    .then(({ data }) => parseWithError(zBlockTxsResponseSequencer, data));
