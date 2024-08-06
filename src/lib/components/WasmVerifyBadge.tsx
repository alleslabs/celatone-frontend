import { Flex, Text } from "@chakra-ui/react";

import { useWasmVerifyInfos } from "lib/services/verification/wasm";
import { WasmVerifyStatus } from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

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

const formatRelatedVerifiedCodes = (relatedVerifiedCodes: number[]) => {
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
        color: "accent.main",
      };
    case BadgeStatus.INDIRECTLY_VERIFIED:
      return {
        label: "Indirectly Verified",
        color: "accent.main",
      };
    default:
      return null;
  }
};

const WasmVerifyIcon = ({ badgeStatus }: { badgeStatus: BadgeStatus }) => {
  switch (badgeStatus) {
    case BadgeStatus.IN_PROGRESS:
      return <CustomIcon name="hourglass" color="text.dark" />;
    case BadgeStatus.VERIFIED:
      return <CustomIcon name="verification-solid" color="accent.main" />;
    case BadgeStatus.INDIRECTLY_VERIFIED:
      return <CustomIcon name="verification" color="accent.main" />;
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

  return (
    <Tooltip label={tooltipText}>
      <Flex as="span" gap={1} alignItems="center">
        <WasmVerifyIcon badgeStatus={badgeStatus} />
        {hasText && textProperties && (
          <Text variant="body2" color={textProperties.color}>
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
      status={getWasmVerifyStatus(wasmVerifyInfo)}
      relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
      hasText={hasText}
      linkedCodeId={linkedCodeId}
    />
  );
};
