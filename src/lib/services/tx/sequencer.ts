import axios from "axios";

import { getOverviewStatsSequencer } from "../stats/sequencer";
import {
  zBlockTxsResponseSequencer,
  zTxsByHashResponseSequencer,
  zTxsResponseSequencer,
} from "../types";
import type { Addr, Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getTxsCountSequencer = async (endpoint: string, chainId: string) =>
  getOverviewStatsSequencer(chainId)
    .then(({ txCount }) => txCount)
    .catch(() =>
      axios
        .get(`${endpoint}/indexer/tx/v1/txs`, {
          params: {
            "pagination.limit": 1,
            "pagination.count_total": true,
          },
        })
        .then(
          ({ data }) =>
            parseWithError(zTxsResponseSequencer, data).pagination.total
        )
    );

export const getTxsSequencer = async (
  endpoint: string,
  paginationKey: Option<string>,
  limit: number
) =>
  axios
    .get(`${endpoint}/indexer/tx/v1/txs`, {
      params: {
        "pagination.limit": limit,
        "pagination.reverse": true,
        "pagination.key": paginationKey,
      },
    })
    .then(({ data }) => parseWithError(zTxsResponseSequencer, data));

export const getTxsByAccountAddressSequencer = async ({
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
}) =>
  axios
    .get(`${endpoint}/indexer/tx/v1/txs/by_account/${encodeURI(address)}`, {
      params: {
        "pagination.limit": limit,
        "pagination.reverse": reverse,
        "pagination.key": paginationKey,
      },
    })
    .then(({ data }) => parseWithError(zTxsResponseSequencer, data));

export const getTxsByHashSequencer = async (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/indexer/tx/v1/txs/${encodeURI(txHash)}`)
    .then(({ data }) => parseWithError(zTxsByHashResponseSequencer, data));

export const getTxsByBlockHeightSequencer = async (
  endpoint: string,
  height: number,
  paginationKey: Option<string>
) =>
  axios
    .get(
      `${endpoint}/indexer/tx/v1/txs/by_height/${encodeURIComponent(height)}`,
      {
        params: {
          "pagination.offset": 0,
          "pagination.limit": 10,
          "pagination.key": paginationKey,
        },
      }
    )
    .then(({ data }) => parseWithError(zBlockTxsResponseSequencer, data));
