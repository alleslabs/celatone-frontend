import axios from "axios";
import { INITIA_DEX_API } from "env";
import { zDexApiPoolsResponse } from "lib/services/types/dex";
import { parseWithError } from "lib/utils";

export const getMoveDexPoolsInfo = () => {
  if (!INITIA_DEX_API) throw new Error("INITIA_DEX_API is not set");

  return axios
    .get(`${INITIA_DEX_API}/indexer/dex/v1/pools`, {
      params: {
        "pagination.count_total": true,
        "pagination.limit": 100,
      },
    })
    .then(({ data }) => parseWithError(zDexApiPoolsResponse, data));
};
