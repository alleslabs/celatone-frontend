import axios from "axios";

import {
  zAccountTxsResponse,
  zBlockTxsResponse,
  zTxByHashResponseLcd,
  zTxsCountResponse,
  zTxsResponse,
} from "../types";
import type { BechAddr, Option, TxFilters } from "lib/types";
import { camelToSnake, parseWithError } from "lib/utils";

export const getTxData = async (txsApiRoute: string, txHash: string) =>
  axios
    .get(`${txsApiRoute}/${encodeURI(txHash.toUpperCase())}`)
    .then(({ data }) => parseWithError(zTxByHashResponseLcd, data));

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
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
        is_initia: isInitia,
      },
    })
    .then(({ data }) => parseWithError(zTxsResponse, data));

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
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
        is_initia: isInitia,
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
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
        is_initia: isInitia,
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
