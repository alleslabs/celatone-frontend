import type { BechAddr, BechAddr20 } from "lib/types";

import axios from "axios";
import { parseWithError } from "lib/utils";

import {
  zTxByHashResponseRest,
  zTxsByAddressResponseRest,
  zTxsByHashResponseRest,
} from "../types";
import { queryWithArchivalFallback } from "../utils";

export const getTxDataRest = (endpoint: string, txHash: string) => {
  const fetch = (endpoint: string) =>
    axios
      .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURI(txHash)}`)
      .then(({ data }) => parseWithError(zTxByHashResponseRest, data));

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getTxsByHashRest = (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURI(txHash)}`)
    .then(({ data }) => parseWithError(zTxsByHashResponseRest, data));

export const getTxsByContractAddressRest = (
  endpoint: string,
  contractAddress: BechAddr,
  limit: number,
  offset: number
) => {
  const fetch = (endpoint: string) =>
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

export const getTxsByAccountAddressRest = (
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
      return parseWithError(zTxsByAddressResponseRest, queryParam.value.data);

    if (eventsParam.status === "fulfilled")
      return parseWithError(zTxsByAddressResponseRest, eventsParam.value.data);

    throw new Error("No data found (getTxsByAccountAddressRest)");
  });
