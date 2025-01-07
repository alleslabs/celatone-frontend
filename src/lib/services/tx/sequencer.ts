import axios from "axios";

import {
  zBlockTxsResponseSequencer,
  zTxsByHashResponseSequencer,
  zTxsResponseSequencer,
} from "../types";
import type {
  Addr,
  Nullable,
  Option,
  TransactionWithSignerPubkey,
} from "lib/types";
import { parseWithError } from "lib/utils";

export const getTxsCountSequencer = async (endpoint: string) =>
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

export const getTxsSequencer = async (
  endpoint: string,
  paginationKey: Option<string>,
  limit: number
) =>
  axios
    .get(`${endpoint}/indexer/tx/v1/txs`, {
      params: {
        "pagination.key": paginationKey,
        "pagination.limit": limit,
        "pagination.reverse": true,
      },
    })
    .then(({ data }) => parseWithError(zTxsResponseSequencer, data));

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
}) =>
  axios
    .get(`${endpoint}/indexer/tx/v1/txs/by_account/${encodeURI(address)}`, {
      params: {
        "pagination.key": paginationKey,
        "pagination.limit": limit,
        "pagination.reverse": reverse,
      },
    })
    .then(({ data }) => parseWithError(zTxsResponseSequencer, data));

export const getTxsByHashSequencer = async (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/indexer/tx/v1/txs/${encodeURI(txHash)}`)
    .then(({ data }) => parseWithError(zTxsByHashResponseSequencer, data));

export const getTxsByBlockHeightSequencer = async (
  endpoint: string,
  height: number
): Promise<TransactionWithSignerPubkey[]> => {
  const result: TransactionWithSignerPubkey[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
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
    result.push(...res.txs);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return result;
};
