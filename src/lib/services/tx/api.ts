import type { BechAddr, Option, PoolTxFilter, TxFilters } from "lib/types";

import axios from "axios";
import { camelToSnake, parseWithError } from "lib/utils";

import {
  zAccountTxsResponse,
  zBlockTxsResponse,
  zTxByHashResponseRest,
  zTxsByPoolIdResponse,
  zTxsByPoolIdTxsCountResponse,
  zTxsCountResponse,
  zTxsResponseWithTxResponse,
} from "../types";

export const getTxData = async (txsApiRoute: string, txHash: string) =>
  axios
    .get(`${txsApiRoute}/${encodeURI(txHash.toUpperCase())}`)
    .then(({ data }) => parseWithError(zTxByHashResponseRest, data));

export const getTxs = async (
  endpoint: string,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean,
  isInitia: boolean
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        is_initia: isInitia,
        is_move: isMove,
        is_wasm: isWasm,
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zTxsResponseWithTxResponse, data));

export const getTxsByAddress = async (
  endpoint: string,
  address: BechAddr,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean,
  isInitia: boolean
) => {
  const filterParams = camelToSnake<TxFilters>(txFilters);

  return axios
    .get(`${endpoint}/${encodeURIComponent(address)}/txs`, {
      params: {
        is_initia: isInitia,
        is_move: isMove,
        is_wasm: isWasm,
        limit,
        offset,
        ...filterParams,
        ...(isSigner !== undefined && { is_signer: isSigner }),
        ...(search !== undefined && { search }),
      },
    })
    .then(({ data }) => parseWithError(zAccountTxsResponse, data));
};

export const getTxsByBlockHeight = async (
  endpoint: string,
  height: number,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean,
  isInitia: boolean
) =>
  axios
    .get(`${endpoint}/${height}/txs`, {
      params: {
        is_initia: isInitia,
        is_move: isMove,
        is_wasm: isWasm,
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zBlockTxsResponse, data));

export const getTxsCountByAddress = async (
  endpoint: string,
  address: BechAddr,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  isWasm: boolean
) => {
  const filterParams = camelToSnake<TxFilters>(txFilters);

  return axios
    .get(`${endpoint}/${encodeURIComponent(address)}/txs-count`, {
      params: {
        ...filterParams,
        is_wasm: isWasm, // only for `searching` contract txs
        ...(isSigner !== undefined && { is_signer: isSigner }),
        ...(search !== undefined && { search }),
      },
    })
    .then(({ data }) => parseWithError(zTxsCountResponse, data));
};

export const getTxsByPoolId = async (
  endpoint: string,
  poolId: number,
  type: PoolTxFilter,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(poolId)}/txs`, {
      params: {
        limit,
        offset,
        type,
      },
    })
    .then(({ data }) => parseWithError(zTxsByPoolIdResponse, data));

export const getTxsByPoolIdTableCounts = async (
  endpoint: string,
  poolId: number,
  type: PoolTxFilter
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(poolId)}/txs-count`, {
      params: {
        type,
      },
    })
    .then(({ data }) => parseWithError(zTxsByPoolIdTxsCountResponse, data));
