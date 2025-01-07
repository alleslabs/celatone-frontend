import axios from "axios";

import type { UploadAccessParams } from "lib/services/types";
import {
  zCodeInfoResponseLcd,
  zCodesResponseLcd,
  zUploadAccessParamsLcd,
  zUploadAccessParamsSubspaceLcd,
} from "lib/services/types";
import type { Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getUploadAccessParamsLcd = async (
  lcdEndpoint: string
): Promise<UploadAccessParams> => {
  const res = await axios.get(`${lcdEndpoint}/cosmwasm/wasm/v1/codes/params`);
  const validated = zUploadAccessParamsLcd.safeParse(res.data);
  if (res.status === 200 && validated.success) return validated.data;

  const res2 = await axios.get(`${lcdEndpoint}/wasm/v1beta1/params`);
  const validated2 = zUploadAccessParamsSubspaceLcd.safeParse(res2.data);
  if (res2.status === 200 && validated2.success) return validated2.data;
  throw new Error("Failed to fetch upload access params");
};

export const getCodesLcd = async (
  endpoint: string,
  paginationKey: Option<string>
) =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code`, {
      params: {
        "pagination.key": paginationKey,
        "pagination.limit": 10,
        "pagination.reverse": true,
      },
    })
    .then(({ data }) => parseWithError(zCodesResponseLcd, data));

export const getCodeLcd = async (endpoint: string, codeId: number) =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code/${encodeURIComponent(codeId)}`)
    .then(({ data }) => parseWithError(zCodeInfoResponseLcd, data));
