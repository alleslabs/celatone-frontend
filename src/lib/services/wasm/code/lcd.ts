import axios from "axios";

import { zCodeInfoResponseLcd, zCodesResponseLcd } from "lib/services/types";
import type { Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getCodesLcd = async (
  endpoint: string,
  paginationKey: Option<string>
) =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code`, {
      params: {
        "pagination.limit": 10,
        "pagination.reverse": true,
        "pagination.key": paginationKey,
      },
    })
    .then(({ data }) => parseWithError(zCodesResponseLcd, data));

export const getCodeByCodeIdLcd = async (endpoint: string, codeId: number) =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code/${codeId}`)
    .then(({ data }) => parseWithError(zCodeInfoResponseLcd, data));
