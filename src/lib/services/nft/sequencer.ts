import axios from "axios";

import { zNftsByAccountResponseSequencer } from "../types";
import type { HexAddr, Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getNftsByAccountSequencer = async (
  endpoint: string,
  accountAddress: HexAddr,
  paginationKey: Option<string>,
  limit = 10,
  search = "",
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
          "pagination.key": paginationKey,
          token_id: search,
          collection_addr: collectionAddress,
        },
      }
    )
    .then(({ data }) => parseWithError(zNftsByAccountResponseSequencer, data));
