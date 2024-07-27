import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

interface VerificationBadgeProps {
  status: VerificationStatus;
  hasText?: boolean;
  type: "contract" | "code";
}

export enum VerificationStatus {
  NOT_VERIFIED,
  IN_PROGRESS,
  VERIFIED,
  INDIRECTLY_VERIFIED,
  FAILED,
}

const getstatusProperties = (status: VerificationStatus) => {
  switch (status) {
    case VerificationStatus.IN_PROGRESS:
      return { label: "In Progress", color: "text.dark" };
    case VerificationStatus.VERIFIED:
      return {
        label: "Verified",
        color: "accent.main",
      };
    case VerificationStatus.INDIRECTLY_VERIFIED:
      return {
        label: "Indirectly Verified",
        color: "accent.main",
      };
    case VerificationStatus.NOT_VERIFIED:
    case VerificationStatus.FAILED:
    default:
      return { color: "text.disabled" };
  }
};

const getTooltipText = (
  type: "contract" | "code",
  status: VerificationStatus
) => {
  if (type === "code") {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return "This code has been verified.";
      case VerificationStatus.INDIRECTLY_VERIFIED:
        return "This code’s hash matches the verified codes of 1232, 1233, 1234 and more.";
      default:
        return undefined;
    }
  } else {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return "This contract has been verified using code 1234, which is confirmed as verified.";
      case VerificationStatus.INDIRECTLY_VERIFIED:
        return "This contract is verified as its base code, 1234, has a code hash that matches other verified codes.";
      default:
        return undefined;
    }
  }
};

const VerificationIcon = ({ status }: { status: VerificationStatus }) => {
  switch (status) {
    case VerificationStatus.IN_PROGRESS:
      return <CustomIcon name="hourglass" color="text.dark" />;
    case VerificationStatus.VERIFIED:
      return <CustomIcon name="verification-solid" color="accent.main" />;
    case VerificationStatus.INDIRECTLY_VERIFIED:
      return <CustomIcon name="verification" color="accent.main" />;
    case VerificationStatus.NOT_VERIFIED:
    case VerificationStatus.FAILED:
    default:
      return undefined;
  }
};

export const VerificationBadge = ({
  status,
  hasText = false,
  type,
}: VerificationBadgeProps) => {
  return (
    <Tooltip label={getTooltipText(type, status)}>
      <Flex gap={1}>
        <VerificationIcon status={status} />
        {hasText && status !== VerificationStatus.NOT_VERIFIED && (
          <Text color={getstatusProperties(status).color}>
            {getstatusProperties(status).label}
          </Text>
        )}
      </Flex>
    </Tooltip>
  );
};
