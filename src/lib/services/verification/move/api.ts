import axios from "axios";

import { INITIA_MOVE_VERIFIER } from "env";
import type {
  MoveVerifyInfoResponse,
  MoveVerifyInfosByModuleResponse,
} from "lib/services/types";
import {
  zMoveVerifyByTaskIdResponse,
  zMoveVerifyInfoResponse,
  zMoveVerifyInfosByModuleResponse,
} from "lib/services/types";
import type { Addr, Nullable } from "lib/types";
import { parseWithError } from "lib/utils";

export const getMoveVerifyByTaskId = async (taskId: string) =>
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

export const getMoveVerifyInfosByModule = async (
  address: Addr
): Promise<Nullable<MoveVerifyInfosByModuleResponse>> =>
  axios
    .get(`${INITIA_MOVE_VERIFIER}/contracts/${encodeURI(address)}`)
    .then(({ data }) => parseWithError(zMoveVerifyInfosByModuleResponse, data));
