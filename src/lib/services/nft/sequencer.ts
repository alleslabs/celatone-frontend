import axios from "axios";

import { zNftsByAccountResponseSequencer } from "../types";
import type { HexAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getNftsByAccountSequencer = async (
  endpoint: string,
  accountAddress: HexAddr
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/tokens/by_account/${encodeURI(accountAddress)}`,
      {
        params: {
          "pagination.count_total": false,
          "pagination.reverse": true,
        },
      }
    )
    .then(({ data }) => parseWithError(zNftsByAccountResponseSequencer, data));
