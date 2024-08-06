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

export const formatRelatedVerifiedCodes = (relatedVerifiedCodes: number[]) => {
  const displayedCodes = relatedVerifiedCodes.slice(0, 3);

  let res = "";
  displayedCodes.forEach((code, index) => {
    res += code.toString();
    if (relatedVerifiedCodes.length > 2 && index < displayedCodes.length - 1)
      res += ",";
    if (index < displayedCodes.length - 1) res += " ";
    if (index === relatedVerifiedCodes.length - 2) res += "and ";
    return res;
  });
  if (relatedVerifiedCodes.length > 3) res += " and more";

  return res;
};
