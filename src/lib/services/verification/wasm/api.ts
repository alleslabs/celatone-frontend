import axios from "axios";

import { CELATONE_VERIFICATION_API } from "env";
import { zWasmVerifyInfosResponse } from "lib/services/types";
import type { WasmVerifyRequest } from "lib/services/types";

export const submitWasmVerify = (wasmVerifyRequest: WasmVerifyRequest) =>
  axios.post(`${CELATONE_VERIFICATION_API}/wasm/verify`, wasmVerifyRequest, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getWasmVerifyInfos = (chainId: string, codeIds: number[]) =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/wasm/verify-infos`, {
      params: {
        chainId,
        codeIds: codeIds.join(","),
      },
    })
    .then(({ data }) => zWasmVerifyInfosResponse.parse(data));
