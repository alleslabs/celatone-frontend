import { chakra, Tag, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { CSSProperties } from "react";

import type {
  HumanAddr,
  PermissionAddresses,
  AccessConfigPermission,
} from "lib/types";
import { getPermissionHelper, resolvePermission } from "lib/utils";

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

  const isAllowed = resolvePermission(
    address as HumanAddr,
    instantiatePermission,
    permissionAddresses
  );

  const tagBgColor: CSSProperties["backgroundColor"] = isAllowed
    ? "honeydew.darker"
    : "pebble.700";

  const { message } = getPermissionHelper(
    address as HumanAddr,
    instantiatePermission,
    permissionAddresses
  );

  return (
    <Tooltip hasArrow label={message} placement="top" bg="honeydew.darker">
      <StyledTag bgColor={tagBgColor}>{instantiatePermission}</StyledTag>
    </Tooltip>
  );
};
