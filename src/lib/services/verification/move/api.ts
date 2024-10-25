import axios from "axios";

import { CELATONE_VERIFICATION_API } from "env";
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
    .post(`${CELATONE_VERIFICATION_API}/move/initia-verify`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => parseWithError(zSubmitMoveVerifyResponse, data));

export const getMoveVerifyByTaskId = async (
  chainId: string,
  taskId: string
): Promise<MoveVerifyByTaskIdResponse> =>
  axios
    .get(
      `${CELATONE_VERIFICATION_API}/move/initia-task-info/${encodeURI(taskId)}`,
      {
        params: { chainId },
      }
    )
    .then(({ data }) => parseWithError(zMoveVerifyByTaskIdResponse, data));

export const getMoveVerifyInfo = async (
  chainId: string,
  address: Addr,
  moduleName: string
): Promise<Nullable<MoveVerifyInfoResponse>> =>
  axios
    .get(
      `${CELATONE_VERIFICATION_API}/move/initia-verify-infos/${encodeURI(address)}/${encodeURI(moduleName)}`,
      {
        params: { chainId },
      }
    )
    .then(({ data }) => parseWithError(zMoveVerifyInfoResponse, data));

export const getMoveVerifyInfosByAddress = async (
  chainId: string,
  address: Addr
): Promise<MoveVerifyInfosByAddressResponse> =>
  axios
    .get(
      `${CELATONE_VERIFICATION_API}/move/initia-verify-infos/${encodeURI(address)}`,
      {
        params: { chainId },
      }
    )
    .then(({ data }) =>
      parseWithError(zMoveVerifyInfosByAddressResponse, data)
    );
