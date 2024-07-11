import axios from "axios";

import {
  zBlockDataResponseSequencer,
  zBlocksResponseSequencer,
} from "../types";
import type { Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getBlocksSequencer = async (
  endpoint: string,
  paginationKey: Option<string>,
  limit: number
) =>
  axios
    .get(`${endpoint}/indexer/block/v1/blocks`, {
      params: {
        "pagination.offset": 0,
        "pagination.limit": limit,
        "pagination.reverse": true,
        "pagination.key": paginationKey,
      },
    })
    .then(({ data }) => parseWithError(zBlocksResponseSequencer, data));

export const getBlockDataSequencer = async (endpoint: string, height: number) =>
  axios
    .get(`${endpoint}/indexer/block/v1/blocks/${height}`)
    .then(({ data }) =>
      parseWithError(zBlockDataResponseSequencer, data.block)
    );
