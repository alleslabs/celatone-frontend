import type { Addr } from "lib/types";

import axios from "axios";
import { parseWithError } from "lib/utils";

import { zEvmInternalTxsResponseSequencer } from "../types";
import { queryWithArchivalFallback } from "../utils";

export const getEvmInternalTxsByBlockHeightSequencer = async (
  endpoint: string,
  height: number,
  limit: number = 10,
  nextKey?: string
) => {
  const fetch = async (endpoint: string) =>
    axios
      .get(
        `${endpoint}/indexer/tx/v1/evm-internal-txs/by_height/${encodeURIComponent(
          height
        )}`,
        {
          params: {
            "pagination.key": nextKey || undefined,
            "pagination.limit": limit,
            "pagination.reverse": false,
          },
        }
      )
      .then(({ data }) =>
        parseWithError(zEvmInternalTxsResponseSequencer, data)
      );

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getEvmInternalTxsByTxHashSequencer = async (
  endpoint: string,
  txHash: string,
  limit: number = 10,
  nextKey?: string
) => {
  const fetch = async (endpoint: string) =>
    axios
      .get(
        `${endpoint}/indexer/tx/v1/evm-internal-txs/${encodeURIComponent(
          txHash
        )}`,
        {
          params: {
            "pagination.key": nextKey || undefined,
            "pagination.limit": limit,
            "pagination.reverse": false,
          },
        }
      )
      .then(({ data }) =>
        parseWithError(zEvmInternalTxsResponseSequencer, data)
      );

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getEvmInternalTxsByAccountAddressSequencer = async (
  endpoint: string,
  address: Addr,
  limit: number = 10,
  nextKey?: string
) => {
  const fetch = async (endpoint: string) =>
    axios
      .get(
        `${endpoint}/indexer/tx/v1/evm-internal-txs/by_account/${encodeURIComponent(
          address
        )}`,
        {
          params: {
            "pagination.key": nextKey || undefined,
            "pagination.limit": limit,
            "pagination.reverse": true,
          },
        }
      )
      .then(({ data }) =>
        parseWithError(zEvmInternalTxsResponseSequencer, data)
      );

  return queryWithArchivalFallback(endpoint, fetch);
};
