import axios from "axios";

import {
  zTxByHashResponseLcd,
  zTxsByAddressResponseLcd,
  zTxsByHashResponseLcd,
} from "../types";
import type { BechAddr20, BechAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";

export const getTxDataLcd = async (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURI(txHash)}`)
    .then(({ data }) => parseWithError(zTxByHashResponseLcd, data));

export const getTxsByHashLcd = async (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURI(txHash)}`)
    .then(({ data }) => parseWithError(zTxsByHashResponseLcd, data));

export const getTxsByContractAddressLcd = async (
  endpoint: string,
  contractAddress: BechAddr32,
  limit: number,
  offset: number
) =>
  Promise.allSettled([
    axios.get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
      params: {
        limit,
        order_by: 2,
        page: offset / limit + 1,
        query: `wasm._contract_address='${encodeURI(contractAddress)}'`,
      },
    }),
    axios.get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
      params: {
        events: `wasm._contract_address='${encodeURI(contractAddress)}'`,
        limit,
        order_by: 2,
        page: offset / limit + 1,
      },
    }),
  ]).then(([queryParam, eventsParam]) => {
    if (queryParam.status === "fulfilled")
      return parseWithError(zTxsByAddressResponseLcd, queryParam.value.data);

    if (eventsParam.status === "fulfilled")
      return parseWithError(zTxsByAddressResponseLcd, eventsParam.value.data);

    throw new Error("No data found (getTxsByContractAddressLcd)");
  });

export const getTxsByAccountAddressLcd = async (
  endpoint: string,
  address: BechAddr20,
  limit: number,
  offset: number
) =>
  Promise.allSettled([
    axios.get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
      params: {
        limit,
        order_by: 2,
        page: offset / limit + 1,
        query: `message.sender='${encodeURI(address)}'`,
      },
    }),
    axios.get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
      params: {
        events: `message.sender='${encodeURI(address)}'`,
        limit,
        order_by: 2,
        page: offset / limit + 1,
      },
    }),
  ]).then(([queryParam, eventsParam]) => {
    if (queryParam.status === "fulfilled")
      return parseWithError(zTxsByAddressResponseLcd, queryParam.value.data);

    if (eventsParam.status === "fulfilled")
      return parseWithError(zTxsByAddressResponseLcd, eventsParam.value.data);

    throw new Error("No data found (getTxsByAccountAddressLcd)");
  });
