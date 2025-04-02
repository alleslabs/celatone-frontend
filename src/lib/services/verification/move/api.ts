import type {
  MoveVerifyByTaskIdResponse,
  MoveVerifyInfoResponse,
  MoveVerifyInfosByAddressResponse,
  SubmitMoveVerifyResponse,
} from "lib/services/types";
import type { Addr, HexAddr, Nullable } from "lib/types";

import axios from "axios";
import { CELATONE_VERIFICATION_API } from "env";
import {
  zMoveVerifyByTaskIdResponse,
  zMoveVerifyInfoResponse,
  zMoveVerifyInfosByAddressResponse,
  zSubmitMoveVerifyResponse,
} from "lib/services/types";
import { zMoveVerifyConfig } from "lib/types";
import { parseWithError } from "lib/utils";

export const getMoveVerifyConfig = () =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/move/config`)
    .then(({ data }) => zMoveVerifyConfig.parse(data));

export const submitMoveVerify = (
  formData: FormData
): Promise<SubmitMoveVerifyResponse> =>
  axios
    .post(`${CELATONE_VERIFICATION_API}/move/verify`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => parseWithError(zSubmitMoveVerifyResponse, data));

export const getMoveVerifyByTaskId = (
  chainId: string,
  taskId: string
): Promise<MoveVerifyByTaskIdResponse> =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/move/task-info`, {
      params: {
        chainId,
        taskId,
      },
    })
    .then(({ data }) => parseWithError(zMoveVerifyByTaskIdResponse, data));

export const getMoveVerifyInfo = (
  chainId: string,
  address: Addr,
  moduleName: string
): Promise<Nullable<MoveVerifyInfoResponse>> =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/move/verify-info`, {
      params: {
        chainId,
        address,
        moduleName,
      },
    })
    .then((res) => parseWithError(zMoveVerifyInfoResponse, res.data));

export const getMoveVerifyInfosByAddress = (
  chainId: string,
  address: HexAddr
): Promise<MoveVerifyInfosByAddressResponse> =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/move/verify-infos`, {
      params: {
        chainId,
        address,
      },
    })
    .then(({ data }) =>
      parseWithError(zMoveVerifyInfosByAddressResponse, data)
    );
