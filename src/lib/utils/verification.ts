import { WasmVerifyStatus } from "lib/types";
import type { Nullish, WasmVerifyInfo } from "lib/types";

export const getWasmVerifyStatus = (
  wasmVerifyInfo: Nullish<WasmVerifyInfo>
) => {
  if (!wasmVerifyInfo) return WasmVerifyStatus.NOT_VERIFIED;

  if (wasmVerifyInfo.verificationInfo === null) {
    if (wasmVerifyInfo.relatedVerifiedCodes.length === 0)
      return WasmVerifyStatus.NOT_VERIFIED;
    return WasmVerifyStatus.INDIRECTLY_VERIFIED;
  }

  if (wasmVerifyInfo.verificationInfo.errorMessage)
    return WasmVerifyStatus.FAILED;

  if (wasmVerifyInfo.verificationInfo.comparedTimestamp === null)
    return WasmVerifyStatus.IN_PROGRESS;

  return WasmVerifyStatus.VERIFIED;
};
