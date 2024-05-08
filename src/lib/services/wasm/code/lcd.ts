import axios from "axios";

import type { CodeInfoResponseLcd, CodesResponseLcd } from "lib/services/types";
import { zCodeInfoResponseLcd, zCodesResponseLcd } from "lib/services/types";
import type { Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getCodeIdInfoLcd = async (
  endpoint: string,
  id: number
): Promise<CodeInfoResponseLcd> =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code/${id}`)
    .then(({ data }) => parseWithError(zCodeInfoResponseLcd, data));

export const getCodesLcd = async (
  endpoint: string,
  paginationKey: Option<string>
): Promise<CodesResponseLcd> =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code`, {
      params: {
        "pagination.limit": 10,
        "pagination.reverse": true,
        "pagination.key": paginationKey,
      },
    })
    .then(({ data }) => parseWithError(zCodesResponseLcd, data));
