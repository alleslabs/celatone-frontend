import type { Addr, Nullable, Option } from "lib/types";

import axios from "axios";
import { parseWithError } from "lib/utils";

import type { TxsResponseItemFromRest } from "../types";

import {
  zBlockTxsResponseSequencer,
  zTxsByHashResponseSequencer,
  zTxsResponseSequencer,
} from "../types";
import { queryWithArchivalFallback } from "../utils";

// NOTE: Replace with new txs count endpoint
export const getTxsCountSequencer = (endpoint: string) =>
  axios
    .get(`${endpoint}/indexer/tx/v1/txs`, {
      params: {
        "pagination.count_total": true,
        "pagination.limit": 1,
      },
    })
    .then(
      ({ data }) => parseWithError(zTxsResponseSequencer, data).pagination.total
    );

export const getTxsSequencer = (
  endpoint: string,
  paginationKey: Option<string>,
  limit: number
) => {
  const fetch = (endpoint: string) =>
    axios
      .get(`${endpoint}/indexer/tx/v1/txs`, {
        params: {
          "pagination.key": paginationKey,
          "pagination.limit": limit,
          "pagination.reverse": true,
        },
      })
      .then(({ data }) => parseWithError(zTxsResponseSequencer, data));

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getTxsByAccountAddressSequencer = async ({
  address,
  endpoint,
  limit,
  paginationKey,
  reverse = true,
}: {
  address: Addr;
  endpoint: string;
  limit?: number;
  paginationKey?: string;
  reverse?: boolean;
}) => {
  const fetch = async (endpoint: string) => {
    const { data } = await axios.get(
      `${endpoint}/indexer/tx/v1/txs/by_account/${encodeURI(address)}`,
      {
        params: {
          "pagination.key": paginationKey,
          "pagination.limit": limit,
          "pagination.reverse": reverse,
        },
      }
    );

    return parseWithError(zTxsResponseSequencer, data);
  };

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getTxsByHashSequencer = (endpoint: string, txHash: string) => {
  const fetch = (endpoint: string) =>
    axios
      .get(`${endpoint}/indexer/tx/v1/txs/${encodeURI(txHash)}`)
      .then(({ data }) => parseWithError(zTxsByHashResponseSequencer, data));

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getTxsByBlockHeightSequencer = async (
  endpoint: string,
  height: number
): Promise<TxsResponseItemFromRest[]> => {
  const result: TxsResponseItemFromRest[] = [];

  const fetchTxsByPaginationKey = async (paginationKey: Nullable<string>) => {
    const fetch = async (endpoint: string, throwErrorIfNoData: boolean) => {
      const { data } = await axios.get(
        `${endpoint}/indexer/tx/v1/txs/by_height/${encodeURIComponent(height)}`,
        {
          params: {
            "pagination.key": paginationKey,
            "pagination.limit": "100",
          },
        }
      );

      const parsed = parseWithError(zBlockTxsResponseSequencer, data);
      if (throwErrorIfNoData && parsed.txs.length === 0) {
        throw new Error("No data found");
      }

      return parsed;
    };

    const res = await queryWithArchivalFallback(endpoint, fetch);
    result.push(...res.txs.map((item) => item));
    if (res.pagination.nextKey)
      await fetchTxsByPaginationKey(res.pagination.nextKey);
  };

  await fetchTxsByPaginationKey(null);

  return result;
};
