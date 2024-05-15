import axios from "axios";

import { zCodeData, zCodesResponse } from "lib/services/types";
import type { CodeData, CodesResponse } from "lib/services/types";
import type { BechAddr, BechAddr20, Option } from "lib/types";
import { parseWithError } from "lib/utils";

export const getCodes = async (
  endpoint: string,
  limit: number,
  offset: number,
  address: Option<BechAddr20>,
  permission: Option<boolean>
): Promise<CodesResponse> =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        address,
        permission,
      },
    })
    .then(({ data }) => parseWithError(zCodesResponse, data));

export const getCodesByAddress = async (
  endpoint: string,
  address: BechAddr,
  limit: number,
  offset: number
): Promise<CodesResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/wasm/codes`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => zCodesResponse.parse(data));

export const getCodeData = async (
  endpoint: string,
  codeId: number,
  isGov: boolean
): Promise<CodeData> =>
  axios
    .get(`${endpoint}/${codeId}/info`, {
      params: {
        is_gov: isGov,
      },
    })
    .then(({ data }) => parseWithError(zCodeData, data));
