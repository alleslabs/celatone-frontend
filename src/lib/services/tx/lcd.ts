import axios from "axios";

import { zAddressTxsResponseLcd } from "../types";
import { parseWithError } from "lib/utils";

export const getTxDataLcd = async (endpoint: string, txHash: string) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`)
    .then(({ data }) => data);

export const getTxsByAddressLcd = async (endpoint: string, address: string) =>
  axios
    .get(
      `${endpoint}/cosmos/tx/v1beta1/txs?events=wasm._contract_address=%27${encodeURIComponent(address)}%27&order_by=2`
    )
    .then(({ data }) => parseWithError(zAddressTxsResponseLcd, data));
