import type { Option } from "lib/types";

import { MoveVerifyStatus } from "lib/types";

export const resolveMoveVerifyStatus = (
  currentDigest: Option<string>,
  verifiedDigest: Option<string>
): MoveVerifyStatus => {
  if (!currentDigest || !verifiedDigest) return MoveVerifyStatus.NotVerified;
  if (currentDigest !== verifiedDigest) return MoveVerifyStatus.Outdated;

  return MoveVerifyStatus.Verified;
};
