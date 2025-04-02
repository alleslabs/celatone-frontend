import { Flex, Text } from "@chakra-ui/react";
import { useWasmVerifyInfos } from "lib/services/verification/wasm";
import { WasmVerifyStatus } from "lib/types";
import { formatRelatedVerifiedCodes, getWasmVerifyStatus } from "lib/utils";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

enum BadgeStatus {
  IN_PROGRESS,
  VERIFIED,
  INDIRECTLY_VERIFIED,
  NONE,
}

const getBadgeStatus = (
  status: WasmVerifyStatus,
  relatedVerifiedCodes: number[]
) => {
  if (status === WasmVerifyStatus.IN_PROGRESS) return BadgeStatus.IN_PROGRESS;
  if (status === WasmVerifyStatus.VERIFIED) return BadgeStatus.VERIFIED;
  if (relatedVerifiedCodes.length > 0) return BadgeStatus.INDIRECTLY_VERIFIED;
  return BadgeStatus.NONE;
};

const getTooltipText = (
  badgeStatus: BadgeStatus,
  relatedVerifyCodes: number[],
  linkedCodeId?: number
) => {
  if (!linkedCodeId) {
    switch (badgeStatus) {
      case BadgeStatus.VERIFIED:
        return "This code has been verified.";
      case BadgeStatus.INDIRECTLY_VERIFIED:
        return `This code’s hash matches the verified codes of ${formatRelatedVerifiedCodes(relatedVerifyCodes)}.`;
      default:
        return undefined;
    }
  } else {
    switch (badgeStatus) {
      case BadgeStatus.VERIFIED:
        return `This contract has been verified using code ${linkedCodeId}, which is confirmed as verified.`;
      case BadgeStatus.INDIRECTLY_VERIFIED:
        return `This contract is verified as its base code, ${linkedCodeId}, has a code hash that matches other verified codes.`;
      default:
        return undefined;
    }
  }
};

const getTextProperties = (badgeStatus: BadgeStatus) => {
  switch (badgeStatus) {
    case BadgeStatus.IN_PROGRESS:
      return { label: "In Progress", color: "text.dark" };
    case BadgeStatus.VERIFIED:
      return {
        label: "Verified",
        color: "secondary.main",
      };
    case BadgeStatus.INDIRECTLY_VERIFIED:
      return {
        label: "Indirectly Verified",
        color: "secondary.main",
      };
    default:
      return null;
  }
};

const WasmVerifyIcon = ({ badgeStatus }: { badgeStatus: BadgeStatus }) => {
  switch (badgeStatus) {
    case BadgeStatus.IN_PROGRESS:
      return <CustomIcon color="text.dark" mx={0} name="hourglass" />;
    case BadgeStatus.VERIFIED:
      return (
        <CustomIcon color="secondary.main" mx={0} name="verification-solid" />
      );
    case BadgeStatus.INDIRECTLY_VERIFIED:
      return <CustomIcon color="secondary.main" mx={0} name="verification" />;
    default:
      return undefined;
  }
};

interface WasmVerifyBadgeProps {
  status: WasmVerifyStatus;
  relatedVerifiedCodes?: number[];
  hasText?: boolean;
  linkedCodeId?: number;
}

export const WasmVerifyBadge = ({
  status,
  relatedVerifiedCodes = [],
  hasText = false,
  linkedCodeId,
}: WasmVerifyBadgeProps) => {
  const badgeStatus = getBadgeStatus(status, relatedVerifiedCodes);

  const tooltipText = getTooltipText(
    badgeStatus,
    relatedVerifiedCodes,
    linkedCodeId
  );
  const textProperties = getTextProperties(badgeStatus);

  if (badgeStatus === BadgeStatus.NONE) return null;

  return (
    <Tooltip label={tooltipText}>
      <Flex alignItems="center" as="span" gap={1}>
        <WasmVerifyIcon badgeStatus={badgeStatus} />
        {hasText && textProperties && (
          <Text color={textProperties.color} variant="body2">
            {textProperties.label}
          </Text>
        )}
      </Flex>
    </Tooltip>
  );
};

export const WasmVerifyBadgeById = ({
  codeId,
  hasText = false,
  linkedCodeId,
}: Pick<WasmVerifyBadgeProps, "hasText" | "linkedCodeId"> & {
  codeId: number;
}) => {
  const { data } = useWasmVerifyInfos([codeId]);
  const wasmVerifyInfo = data?.[codeId];

  return (
    <WasmVerifyBadge
      hasText={hasText}
      linkedCodeId={linkedCodeId}
      relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
      status={getWasmVerifyStatus(wasmVerifyInfo)}
    />
  );
};
