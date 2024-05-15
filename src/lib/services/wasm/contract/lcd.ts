import axios from "axios";

import { zContractLcd } from "lib/services/types";
import type { BechAddr32, JsonDataType } from "lib/types";
import { encode, parseWithError } from "lib/utils";

export const getContractQueryLcd = (
  endpoint: string,
  contractAddress: BechAddr32,
  msg: string
): JsonDataType =>
  axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}/smart/${encode(msg)}`
    )
    .then(({ data }) => data);

export const getContractLcd = (endpoint: string, contractAddress: BechAddr32) =>
  axios(
    `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}`
  ).then(({ data }) => parseWithError(zContractLcd, data));
