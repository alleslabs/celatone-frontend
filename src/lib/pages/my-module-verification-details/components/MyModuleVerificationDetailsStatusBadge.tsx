import { Tag, TagLabel } from "@chakra-ui/react";

import { ActiveDot } from "lib/components/ActiveDot";
import { CustomIcon } from "lib/components/icon";
import { MoveVerifyTaskStatus } from "lib/services/types";

interface MyModuleVerificationDetailsStatusBadgeProps {
  status: MoveVerifyTaskStatus;
  hasCloseBtn?: boolean;
  isActiveOnVerifying?: boolean;
}

export const MyModuleVerificationDetailsStatusBadge = ({
  status,
  hasCloseBtn,
  isActiveOnVerifying = true,
}: MyModuleVerificationDetailsStatusBadgeProps) => {
  const renderStatus = () => {
    if (status === MoveVerifyTaskStatus.Pending)
      return (
        <>
          <ActiveDot bg="gray.600" isActive={false} />
          <TagLabel>Pending</TagLabel>
        </>
      );

    if (status === MoveVerifyTaskStatus.NotFound)
      return (
        <>
          <ActiveDot bg="error.main" isActive={false} />
          <TagLabel>Failed</TagLabel>
        </>
      );

    if (status === MoveVerifyTaskStatus.Finished)
      return (
        <>
          <ActiveDot bg="success.main" isActive={false} />
          <TagLabel>Completed</TagLabel>
        </>
      );

    return (
      <>
        <ActiveDot bg="primary.main" isActive={isActiveOnVerifying} />
        <TagLabel>Verifying</TagLabel>
      </>
    );
  };

  return (
    <Tag size="md" variant="gray" w="fit-content" gap={1}>
      {renderStatus()}
      {hasCloseBtn && <CustomIcon name="close" boxSize={3} mr={0} />}
    </Tag>
  );
};
