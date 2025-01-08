import axios from "axios";

import {
  zBlockDataResponseSequencer,
  zBlocksResponseSequencer,
  zBlockTimeAverageSequencer,
} from "../types";
import type { Option } from "lib/types";
import { parseWithError } from "lib/utils";

// NOTE: There is a bug in /indexer/block/v1/blocks, so we have to increase last byte by 1
function incrementLastByte(base64: string): string {
  // Decode base64 to buffer
  const buffer = Buffer.from(base64, "base64");

  // Increment the last byte
  let i = buffer.length - 1;
  buffer[i] += 1;
  while (Math.floor(buffer[i] / 256) > 0 && i > 0) {
    buffer[i] %= 256;
    buffer[i - 1] += 1;
    i -= 1;
  }

  // Convert buffer back to base64
  return buffer.toString("base64");
}

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
        "pagination.key": paginationKey
          ? incrementLastByte(paginationKey)
          : undefined,
      },
    })
    .then(({ data }) => parseWithError(zBlocksResponseSequencer, data));

export const getBlockTimeAverageSequencer = async (endpoint: string) =>
  axios
    .get(`${endpoint}/indexer/block/v1/avg_blocktime`)
    .then(({ data }) => parseWithError(zBlockTimeAverageSequencer, data));

export const getBlockDataSequencer = async (endpoint: string, height: number) =>
  axios
    .get(`${endpoint}/indexer/block/v1/blocks/${height}`)
    .then(({ data }) =>
      parseWithError(zBlockDataResponseSequencer, data.block)
    );
