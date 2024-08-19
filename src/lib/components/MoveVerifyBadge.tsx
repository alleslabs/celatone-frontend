import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "./icon";
import { MoveVerifyStatus } from "./move-verify-section";

interface MoveVerifyBadgeProps {
  status: MoveVerifyStatus;
  boxSize?: number;
}

const MoveVerifyIcon = ({ status, boxSize = 5 }: MoveVerifyBadgeProps) => {
  if (status === MoveVerifyStatus.Outdated) {
    return (
      <CustomIcon
        name="verification-solid"
        opacity={0.5}
        color="secondary.main"
        boxSize={boxSize}
      />
    );
  }
  if (status === MoveVerifyStatus.Verified) {
    return (
      <CustomIcon
        name="verification-solid"
        color="secondary.main"
        boxSize={boxSize}
      />
    );
  }
  return undefined;
};

export const MoveVerifyBadge = ({ status, boxSize }: MoveVerifyBadgeProps) => {
  return (
    <Flex as="span" gap={1} alignItems="center">
      <MoveVerifyIcon status={status} boxSize={boxSize} />
    </Flex>
  );
};
