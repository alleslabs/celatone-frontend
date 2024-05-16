import axios from "axios";

import { zContractLcd, zContractsResponseLcd } from "lib/services/types";
import type { BechAddr32, JsonDataType, Option } from "lib/types";
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

export const getContractsByCodeIdLcd = (
  endpoint: string,
  codeId: number,
  paginationKey: Option<string>
) =>
  axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/code/${encodeURIComponent(codeId)}/contracts`,
      {
        params: {
          "pagination.limit": 10,
          "pagination.reverse": true,
          "pagination.key": paginationKey,
        },
      }
    )
    .then(({ data }) => parseWithError(zContractsResponseLcd, data));
