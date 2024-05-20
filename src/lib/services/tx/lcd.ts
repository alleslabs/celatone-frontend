import axios from "axios";

import { zTxsByAddressResponseLcd } from "../types";
import type { BechAddr20, BechAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";

export const getTxDataLcd = async (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`)
    .then(({ data }) => data);

export const getTxsByContractAddressLcd = async (
  endpoint: string,
  address: BechAddr32
) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
      params: {
        events: `wasm._contract_address=%27${encodeURI(address)}%27`,
        order_by: 2,
      },
    })
    .then(({ data }) => parseWithError(zTxsByAddressResponseLcd, data));

export const getTxsByAccountAddressLcd = async (
  endpoint: string,
  address: BechAddr20
) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
      params: {
        events: `message.sender=%27${encodeURI(address)}%27`,
        order_by: 2,
      },
    })
    .then(({ data }) => parseWithError(zTxsByAddressResponseLcd, data));
