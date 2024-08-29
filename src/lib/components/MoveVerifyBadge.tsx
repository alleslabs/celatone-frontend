import { Tooltip } from "lib/components/Tooltip";
import { MoveVerifyStatus } from "lib/types";

import { CustomIcon } from "./icon";

interface MoveVerifyBadgeProps {
  status: MoveVerifyStatus;
  hasTooltip?: boolean;
}

const MoveVerifyBadgeIcon = ({
  status,
}: Pick<MoveVerifyBadgeProps, "status">) => {
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

const getMoveVerifyBadgeLabel = (status: MoveVerifyStatus) => {
  if (status === MoveVerifyStatus.Outdated) {
    return "This module was republished after verification.";
  }
  if (status === MoveVerifyStatus.Verified) {
    return "This module has been verified.";
  }
  return undefined;
};

export const MoveVerifyBadge = ({
  status,
  hasTooltip = false,
}: MoveVerifyBadgeProps) => (
  <Tooltip hidden={!hasTooltip} label={getMoveVerifyBadgeLabel(status)}>
    <MoveVerifyBadgeIcon status={status} />
  </Tooltip>
);
