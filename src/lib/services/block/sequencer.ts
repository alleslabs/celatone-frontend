import type { Option } from "lib/types";

import axios from "axios";
import { parseWithError } from "lib/utils";

import {
  zBlockDataResponseSequencer,
  zBlocksResponseSequencer,
  zBlockTimeAverageSequencer,
} from "../types";
import { queryWithArchivalFallback } from "../utils";

export const getBlocksSequencer = async (
  endpoint: string,
  paginationKey: Option<string>,
  limit: number
) => {
  const fetch = async (endpoint: string, throwErrorIfNoData: boolean) => {
    const { data } = await axios.get(`${endpoint}/indexer/block/v1/blocks`, {
      params: {
        "pagination.key": paginationKey,
        "pagination.limit": limit,
        "pagination.offset": 0,
        "pagination.reverse": true,
      },
    });

    const parsed = parseWithError(zBlocksResponseSequencer, data);
    if (throwErrorIfNoData && parsed.blocks.length === 0) {
      throw new Error("No data found");
    }

    return parsed;
  };

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getBlockTimeAverageSequencer = (endpoint: string) =>
  axios
    .get(`${endpoint}/indexer/block/v1/avg_blocktime`)
    .then(({ data }) => parseWithError(zBlockTimeAverageSequencer, data));

export const getBlockDataSequencer = (endpoint: string, height: number) => {
  const fetch = (endpoint: string) =>
    axios
      .get(`${endpoint}/indexer/block/v1/blocks/${height}`)
      .then(({ data }) =>
        parseWithError(zBlockDataResponseSequencer, data.block)
      );

  return queryWithArchivalFallback(endpoint, fetch);
};
