import axios from "axios";

import type { UploadAccessParams } from "lib/services/types";
import {
  zCodeInfoResponseRest,
  zCodesResponseRest,
  zUploadAccessParamsRest,
  zUploadAccessParamsSubspaceRest,
} from "lib/services/types";
import type { Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getUploadAccessParamsRest = async (
  restEndpoint: string
): Promise<UploadAccessParams> => {
  const res = await axios.get(`${restEndpoint}/cosmwasm/wasm/v1/codes/params`);
  const validated = zUploadAccessParamsRest.safeParse(res.data);
  if (res.status === 200 && validated.success) return validated.data;

  const res2 = await axios.get(`${restEndpoint}/wasm/v1beta1/params`);
  const validated2 = zUploadAccessParamsSubspaceRest.safeParse(res2.data);
  if (res2.status === 200 && validated2.success) return validated2.data;
  throw new Error("Failed to fetch upload access params");
};

export const getCodesRest = async (
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
    .then(({ data }) => parseWithError(zCodesResponseRest, data));

export const getCodeRest = async (endpoint: string, codeId: number) =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code/${encodeURIComponent(codeId)}`)
    .then(({ data }) => parseWithError(zCodeInfoResponseRest, data));
