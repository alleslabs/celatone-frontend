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
  address: BechAddr32,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/cosmos/tx/v1beta1/txs?events=wasm._contract_address=%27${encodeURI(address)}%27`,
      {
        params: {
          order_by: 2,
          limit,
          page: offset / limit + 1,
        },
      }
    )
    .then(({ data }) => parseWithError(zTxsByAddressResponseLcd, data));

export const getTxsByAccountAddressLcd = async (
  endpoint: string,
  address: BechAddr20,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/cosmos/tx/v1beta1/txs?events=message.sender=%27${encodeURI(address)}%27`,
      {
        params: {
          order_by: 2,
          limit,
          page: offset / limit + 1,
        },
      }
    )
    .then(({ data }) => parseWithError(zTxsByAddressResponseLcd, data));
