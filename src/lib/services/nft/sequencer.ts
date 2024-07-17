import axios from "axios";

import { zNftsByAccountResponseSequencer } from "../types";
import type { HexAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getNftsByAccountSequencer = async (
  endpoint: string,
  accountAddress: HexAddr,
  limit: number,
  collectionAddress?: string
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/tokens/by_account/${encodeURI(accountAddress)}`,
      {
        params: {
          "pagination.count_total": false,
          "pagination.reverse": true,
          "pagination.limit": limit,
          collection_addr: collectionAddress,
        },
      }
    )
    .then(({ data }) => parseWithError(zNftsByAccountResponseSequencer, data));
