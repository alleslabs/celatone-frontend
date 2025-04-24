import { Tooltip } from "lib/components/Tooltip";
import { MoveVerifyStatus } from "lib/types";

import { CustomIcon } from "./icon";

interface MoveVerifyBadgeProps {
  hasTooltip?: boolean;
  status: MoveVerifyStatus;
}

const MoveVerifyBadgeIcon = ({
  status,
}: Pick<MoveVerifyBadgeProps, "status">) => {
  if (status === MoveVerifyStatus.Outdated) {
    return (
      <CustomIcon
        color="secondary.main"
        mx={0}
        name="verification-solid"
        opacity={0.5}
      />
    );
  }
  if (status === MoveVerifyStatus.Verified) {
    return (
      <CustomIcon color="secondary.main" mx={0} name="verification-solid" />
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
  hasTooltip = false,
  status,
}: MoveVerifyBadgeProps) => (
  <Tooltip hidden={!hasTooltip} label={getMoveVerifyBadgeLabel(status)}>
    <MoveVerifyBadgeIcon status={status} />
  </Tooltip>
);
