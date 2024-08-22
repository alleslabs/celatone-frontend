import type { MoveVerifyInfoResponse } from "lib/services/types";
import type { IndexedModule, Nullable } from "lib/types";
import { MoveVerifyStatus } from "lib/types";

export const resolveMoveVerifyStatus = (
  moduleInfo?: IndexedModule,
  verificationData?: Nullable<MoveVerifyInfoResponse>
): MoveVerifyStatus => {
  if (!verificationData || !moduleInfo) return MoveVerifyStatus.NotVerified;
  if (verificationData.base64 !== moduleInfo.rawBytes)
    return MoveVerifyStatus.Outdated;

  return MoveVerifyStatus.Verified;
};
