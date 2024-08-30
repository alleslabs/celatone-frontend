import axios from "axios";

import { INITIA_MOVE_VERIFIER } from "env";
import type {
  MoveVerifyByTaskIdResponse,
  MoveVerifyInfoResponse,
  MoveVerifyInfosByAddressResponse,
  SubmitMoveVerifyResponse,
} from "lib/services/types";
import {
  zMoveVerifyByTaskIdResponse,
  zMoveVerifyInfoResponse,
  zMoveVerifyInfosByAddressResponse,
  zSubmitMoveVerifyResponse,
} from "lib/services/types";
import type { Addr, Nullable } from "lib/types";
import { parseWithError } from "lib/utils";

export const submitMoveVerify = async (
  formData: FormData
): Promise<SubmitMoveVerifyResponse> =>
  axios
    .post(`${INITIA_MOVE_VERIFIER}/contracts/verify`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => parseWithError(zSubmitMoveVerifyResponse, data));

export const getMoveVerifyByTaskId = async (
  taskId: string
): Promise<MoveVerifyByTaskIdResponse> =>
  axios
    .get(`${INITIA_MOVE_VERIFIER}/contracts/task/${encodeURI(taskId)}`)
    .then(({ data }) => parseWithError(zMoveVerifyByTaskIdResponse, data));

export const getMoveVerifyInfo = async (
  address: Addr,
  moduleName: string
): Promise<Nullable<MoveVerifyInfoResponse>> =>
  axios
    .get(
      `${INITIA_MOVE_VERIFIER}/contracts/verify/${encodeURI(address)}/${encodeURI(moduleName)}`
    )
    .then(({ data }) => parseWithError(zMoveVerifyInfoResponse, data));

export const getMoveVerifyInfosByAddress = async (
  address: Addr
): Promise<MoveVerifyInfosByAddressResponse> =>
  axios
    .get(`${INITIA_MOVE_VERIFIER}/contracts/${encodeURI(address)}`)
    .then(({ data }) =>
      parseWithError(zMoveVerifyInfosByAddressResponse, data)
    );
