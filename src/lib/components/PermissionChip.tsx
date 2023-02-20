import { chakra, Tag, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { CSSProperties } from "react";

import type { Addr, HumanAddr, PermissionAddresses } from "lib/types";
import { InstantiatePermission } from "lib/types";
import { truncate } from "lib/utils";

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
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
}

export const getPermissionHelper = (
  address: Addr | undefined,
  instantiatePermission: InstantiatePermission,
  permissionAddresses: PermissionAddresses
) => {
  const getMessage = () => {
    switch (instantiatePermission) {
      case InstantiatePermission.EVERYBODY:
        return "Everyone can instantiate contract with this code";
      case InstantiatePermission.NOBODY:
        return "You can instantiate contract with this code through proposal only";
      case InstantiatePermission.ANY_OF_ADDRESSES:
        return address && permissionAddresses.includes(address)
          ? "You are included in designated addresses to instantiate"
          : "This code can be instantiate by designated addresses";
      case InstantiatePermission.ONLY_ADDRESS:
        return address && permissionAddresses.includes(address)
          ? "You are designated to instantiate contract from this code"
          : `This code can only be instantiated by ${truncate(
              permissionAddresses.at(0)
            )}`;
      default:
        return "Valid Code ID";
    }
  };
  const getColor = () =>
    instantiatePermission === InstantiatePermission.EVERYBODY ||
    (address && permissionAddresses.includes(address))
      ? "success.main"
      : "info.main";

  return { message: getMessage(), messageColor: getColor() };
};

export const PermissionChip = ({
  instantiatePermission,
  permissionAddresses,
}: PermissionChipProps) => {
  const { address } = useWallet();

  const isAllowed =
    permissionAddresses.includes(address as HumanAddr) ||
    instantiatePermission === InstantiatePermission.EVERYBODY;

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
