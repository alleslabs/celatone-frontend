import axios from "axios";

import { zCollectionsByAccountResponseSequencer } from "../types";
import type { HexAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getCollectionsByAccountSequencer = async (
  endpoint: string,
  accountAddress: HexAddr
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/collections/by_account/${encodeURI(accountAddress)}`,
      {
        params: {
          "pagination.count_total": false,
          "pagination.reverse": true,
        },
      }
    )
    .then(({ data }) =>
      parseWithError(zCollectionsByAccountResponseSequencer, data)
    );
