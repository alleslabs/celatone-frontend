import { chakra, Tag } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { CSSProperties } from "react";

import type { HumanAddr, PermissionAddresses } from "lib/types";
import { InstantiatePermission } from "lib/types";

const StyledTag = chakra(Tag, {
  baseStyle: {
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 400,
    color: "text.main",
  },
});

interface PermissionChipProps {
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
}

export const PermissionChip = ({
  instantiatePermission,
  permissionAddresses,
}: PermissionChipProps) => {
  const { address = "" } = useWallet();

  const isAllowed =
    permissionAddresses.includes(address as HumanAddr) ||
    instantiatePermission === InstantiatePermission.EVERYBODY;

  const tagBgColor: CSSProperties["backgroundColor"] = isAllowed
    ? "rgba(161, 230, 143, 0.5)"
    : "rgba(173, 173, 173, 0.6)";

  return <StyledTag bgColor={tagBgColor}>{instantiatePermission}</StyledTag>;
};
