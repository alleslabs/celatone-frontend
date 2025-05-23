import type { UploadAccessParams } from "lib/services/types";
import type { Option } from "lib/types";

import axios from "axios";
import {
  zCodeInfoResponseRest,
  zCodesResponseRest,
  zUploadAccessParams,
} from "lib/services/types";
import { parseWithError } from "lib/utils";

export const getUploadAccessParamsRest = (
  restEndpoint: string
): Promise<UploadAccessParams> =>
  axios
    .get(`${restEndpoint}/cosmwasm/wasm/v1/codes/params`)
    .then(({ data }) => parseWithError(zUploadAccessParams, data));

export const getCodesRest = (endpoint: string, paginationKey: Option<string>) =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code`, {
      params: {
        "pagination.key": paginationKey,
        "pagination.limit": 10,
        "pagination.reverse": true,
      },
    })
    .then(({ data }) => parseWithError(zCodesResponseRest, data));

export const getCodeRest = (endpoint: string, codeId: number) =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code/${encodeURIComponent(codeId)}`)
    .then(({ data }) => parseWithError(zCodeInfoResponseRest, data));
