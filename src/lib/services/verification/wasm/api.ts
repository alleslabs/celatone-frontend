import type { WasmVerifyRequest } from "lib/services/types";

import axios from "axios";
import { CELATONE_VERIFICATION_API } from "env";
import {
  zWasmRelatedVerifyInfosResponse,
  zWasmVerifyInfosResponse,
} from "lib/services/types";

export const submitWasmVerify = async (
  wasmVerifyRequest: WasmVerifyRequest
) => {
  await axios.post(
    `${CELATONE_VERIFICATION_API}/wasm/verify`,
    wasmVerifyRequest,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getWasmVerifyInfos = (chainId: string, codeIds: number[]) =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/wasm/verify-infos`, {
      params: {
        chainId,
        codeIds: codeIds.join(","),
      },
    })
    .then(({ data }) => zWasmVerifyInfosResponse.parse(data));

export const getWasmRelatedVerifyInfos = (chainId: string, hashes: string[]) =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/wasm/related-verify-infos`, {
      params: {
        chainId,
        hashes: hashes.join(","),
      },
    })
    .then(({ data }) => zWasmRelatedVerifyInfosResponse.parse(data));
