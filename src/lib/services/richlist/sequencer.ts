import axios from "axios";
import { parseWithError } from "lib/utils";

import { zRichlistResponseSequencer } from "../types/richlist";
import { queryWithArchivalFallback } from "../utils";

export const getRichlistSequencer = async ({
  denom,
  endpoint,
  limit = 10,
  offset = 0,
  reverse = true,
}: {
  denom: string;
  endpoint: string;
  limit?: number;
  offset?: number;
  reverse?: boolean;
}) => {
  const fetch = async (endpoint: string) => {
    const { data } = await axios.get(
      `${endpoint}/indexer/richlist/v1/${encodeURIComponent(denom)}`,
      {
        params: {
          "pagination.limit": limit,
          "pagination.offset": offset,
          "pagination.reverse": reverse,
        },
      }
    );
    return parseWithError(zRichlistResponseSequencer, data);
  };

  return queryWithArchivalFallback(endpoint, fetch);
};
