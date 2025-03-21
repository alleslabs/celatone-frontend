import axios from "axios";

import type { BechAddr20, BechAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";
import {
  zTxByHashResponseRest,
  zTxsByAddressResponseRest,
  zTxsByHashResponseRest,
} from "../types";
import { queryWithArchivalFallback } from "../utils";

export const getTxDataRest = async (endpoint: string, txHash: string) => {
  const fetch = async (endpoint: string) =>
    axios
      .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURI(txHash)}`)
      .then(({ data }) => parseWithError(zTxByHashResponseRest, data));

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getTxsByHashRest = async (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURI(txHash)}`)
    .then(({ data }) => parseWithError(zTxsByHashResponseRest, data));

export const getTxsByContractAddressRest = async (
  endpoint: string,
  contractAddress: BechAddr32,
  limit: number,
  offset: number
) => {
  const fetch = async (endpoint: string) =>
    Promise.allSettled([
      axios.get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
        params: {
          order_by: 2,
          limit,
          page: offset / limit + 1,
          query: `wasm._contract_address='${encodeURI(contractAddress)}'`,
        },
      }),
      axios.get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
        params: {
          order_by: 2,
          limit,
          page: offset / limit + 1,
          events: `wasm._contract_address='${encodeURI(contractAddress)}'`,
        },
      }),
    ]).then(([queryParam, eventsParam]) => {
      if (queryParam.status === "fulfilled")
        return parseWithError(zTxsByAddressResponseRest, queryParam.value.data);

      if (eventsParam.status === "fulfilled")
        return parseWithError(
          zTxsByAddressResponseRest,
          eventsParam.value.data
        );

      throw new Error("No data found (getTxsByContractAddressRest)");
    });

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getTxsByAccountAddressRest = async (
  endpoint: string,
  address: BechAddr20,
  limit: number,
  offset: number
) =>
  Promise.allSettled([
    axios.get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
      params: {
        order_by: 2,
        limit,
        page: offset / limit + 1,
        query: `message.sender='${encodeURI(address)}'`,
      },
    }),
    axios.get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
      params: {
        order_by: 2,
        limit,
        page: offset / limit + 1,
        events: `message.sender='${encodeURI(address)}'`,
      },
    }),
  ]).then(([queryParam, eventsParam]) => {
    if (queryParam.status === "fulfilled")
      return parseWithError(zTxsByAddressResponseRest, queryParam.value.data);

    if (eventsParam.status === "fulfilled")
      return parseWithError(zTxsByAddressResponseRest, eventsParam.value.data);

    throw new Error("No data found (getTxsByAccountAddressRest)");
  });
