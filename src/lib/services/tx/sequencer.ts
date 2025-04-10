import type {
  Addr,
  Nullable,
  Option,
  TransactionWithSignerPubkey,
} from "lib/types";

import axios from "axios";
import { parseWithError } from "lib/utils";

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
        "pagination.limit": 1,
        "pagination.count_total": true,
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
          "pagination.limit": limit,
          "pagination.reverse": true,
          "pagination.key": paginationKey,
        },
      })
      .then(({ data }) => parseWithError(zTxsResponseSequencer, data));

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getTxsByAccountAddressSequencer = ({
  endpoint,
  address,
  paginationKey,
  limit,
  reverse = true,
}: {
  endpoint: string;
  address: Addr;
  paginationKey?: string;
  limit?: number;
  reverse?: boolean;
}) => {
  const fetch = (endpoint: string) =>
    axios
      .get(`${endpoint}/indexer/tx/v1/txs/by_account/${encodeURI(address)}`, {
        params: {
          "pagination.limit": limit,
          "pagination.reverse": reverse,
          "pagination.key": paginationKey,
        },
      })
      .then(({ data }) => parseWithError(zTxsResponseSequencer, data));

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
): Promise<TransactionWithSignerPubkey[]> => {
  const result: TransactionWithSignerPubkey[] = [];

  const fetchTxsByPaginationKey = async (paginationKey: Nullable<string>) => {
    const fetch = (endpoint: string) =>
      axios
        .get(
          `${endpoint}/indexer/tx/v1/txs/by_height/${encodeURIComponent(height)}`,
          {
            params: {
              "pagination.key": paginationKey,
              "pagination.limit": "500",
            },
          }
        )
        .then(({ data }) => parseWithError(zBlockTxsResponseSequencer, data));

    const res = await queryWithArchivalFallback(endpoint, fetch);
    result.push(...res.txs);
    if (res.pagination.nextKey)
      await fetchTxsByPaginationKey(res.pagination.nextKey);
  };

  await fetchTxsByPaginationKey(null);

  return result;
};
