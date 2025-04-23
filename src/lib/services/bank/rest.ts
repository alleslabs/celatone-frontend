import type { BechAddr, Coin, Nullable } from "lib/types";

import axios from "axios";
import { parseWithError } from "lib/utils";

import { zBalancesReponseRest } from "../types";

export const getBalancesRest = async (
  endpoint: string,
  address: BechAddr
): Promise<Coin[]> => {
  const result: Coin[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(`${endpoint}/cosmos/bank/v1beta1/balances/${encodeURI(address)}`, {
        params: {
          "pagination.key": paginationKey,
          "pagination.limit": "100",
        },
      })
      .then(({ data }) => parseWithError(zBalancesReponseRest, data));
    result.push(...res.balances);
    if (res.pagination?.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return result;
};
