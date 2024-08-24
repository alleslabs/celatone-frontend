import { MoveVerifyStatus } from "lib/types";

import { CustomIcon } from "./icon";

interface MoveVerifyBadgeProps {
  status: MoveVerifyStatus;
}

export const MoveVerifyBadge = ({ status }: MoveVerifyBadgeProps) => {
  if (status === MoveVerifyStatus.Outdated) {
    return (
      <CustomIcon
        name="verification-solid"
        opacity={0.5}
        color="secondary.main"
        mx={0}
      />
    );
  }
  if (status === MoveVerifyStatus.Verified) {
    return (
      <CustomIcon name="verification-solid" color="secondary.main" mx={0} />
    );
  }
  return undefined;
};
