import type { Addr } from "lib/types";

import axios from "axios";
import { parseWithError } from "lib/utils";

import type { EvmTxsResponseSequencer } from "../types";

import { zEvmTxResponseSequencer, zEvmTxsResponseSequencer } from "../types";
import { queryWithArchivalFallback } from "../utils";

export const getEvmTxsByBlockHeightSequencer = (
  endpoint: string,
  height: number,
  limit: number = 10,
  nextKey?: string,
  countTotal: boolean = false
): Promise<EvmTxsResponseSequencer> => {
  const fetch = async (endpoint: string) =>
    axios
      .get(
        `${endpoint}/indexer/tx/v1/evm-txs/by_height/${encodeURIComponent(height)}`,
        {
          params: {
            "pagination.count_total": countTotal,
            "pagination.key": nextKey || undefined,
            "pagination.limit": limit,
            "pagination.reverse": false,
          },
        }
      )
      .then(({ data }) => parseWithError(zEvmTxsResponseSequencer, data));

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getEvmTxsSequencer = (
  endpoint: string,
  limit = 10,
  nextKey?: string,
  countTotal: boolean = false
): Promise<EvmTxsResponseSequencer> => {
  return axios
    .get(`${endpoint}/indexer/tx/v1/evm-txs`, {
      params: {
        "pagination.count_total": countTotal,
        "pagination.key": nextKey || undefined,
        "pagination.limit": limit,
      },
    })
    .then(({ data }) => parseWithError(zEvmTxsResponseSequencer, data));
};

export const getEvmTxsByAccountAddressSequencer = (
  endpoint: string,
  address: Addr,
  limit = 10,
  nextKey?: string,
  countTotal: boolean = false
): Promise<EvmTxsResponseSequencer> => {
  return axios
    .get(
      `${endpoint}/indexer/tx/v1/evm-txs/by_account/${encodeURIComponent(
        address
      )}`,
      {
        params: {
          "pagination.count_total": countTotal,
          "pagination.key": nextKey || undefined,
          "pagination.limit": limit,
        },
      }
    )
    .then(({ data }) => parseWithError(zEvmTxsResponseSequencer, data));
};

export const getEvmTxsByTxHashSequencer = (
  endpoint: string,
  txHash: string
) => {
  return axios
    .get(`${endpoint}/indexer/tx/v1/evm-txs/${encodeURIComponent(txHash)}`)
    .then(({ data }) => parseWithError(zEvmTxResponseSequencer, data));
};
