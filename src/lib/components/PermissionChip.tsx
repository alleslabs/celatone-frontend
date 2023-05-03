import { chakra, Tag } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { CSSProperties } from "react";

import type { HumanAddr, PermissionAddresses } from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { getPermissionHelper } from "lib/utils";

import { Tooltip } from "./TooltipComponent";

const StyledTag = chakra(Tag, {
  baseStyle: {
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 400,
    color: "text.main",
    w: "fit-content",
  },
});

interface PermissionChipProps {
  instantiatePermission: AccessConfigPermission;
  permissionAddresses: PermissionAddresses;
}

export const PermissionChip = ({
  instantiatePermission,
  permissionAddresses,
}: PermissionChipProps) => {
  const { address } = useWallet();

  const isAllowed =
    permissionAddresses.includes(address as HumanAddr) ||
    instantiatePermission === AccessConfigPermission.EVERYBODY;

  const tagBgColor: CSSProperties["backgroundColor"] = isAllowed
    ? "honeydew.darker"
    : "pebble.700";

  const { message } = getPermissionHelper(
    address as HumanAddr,
    instantiatePermission,
    permissionAddresses
  );

  return (
    <Tooltip label={message}>
      <StyledTag bgColor={tagBgColor}>{instantiatePermission}</StyledTag>
    </Tooltip>
  );
};
