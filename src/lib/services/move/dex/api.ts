import axios from "axios";
import { INITIA_DEX_API } from "env";
import { zDexApiPoolsResponse } from "lib/services/types/dex";
import { parseWithError } from "lib/utils";

export const getMoveDexPoolsInfo = () =>
  axios
    .get(`${INITIA_DEX_API}/indexer/dex/v1/pools`, {
      params: {
        pagination: {
          count_total: true,
          limit: 100,
        },
      },
    })
    .then(({ data }) => parseWithError(zDexApiPoolsResponse, data));
