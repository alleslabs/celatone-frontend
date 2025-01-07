import type { BechAddr20, Option, PermissionAddresses } from "lib/types";
import { AccessConfigPermission } from "lib/types";

import { truncate } from "./truncate";

export const resolvePermission = (
  address: Option<BechAddr20>,
  permission: AccessConfigPermission = AccessConfigPermission.UNKNOWN,
  permissionAddresses: PermissionAddresses = []
): boolean =>
  permission === AccessConfigPermission.EVERYBODY ||
  (address ? permissionAddresses.includes(address) : false);

export const getPermissionHelper = (
  address: Option<BechAddr20>,
  instantiatePermission: AccessConfigPermission,
  permissionAddresses: PermissionAddresses
) => {
  const getMessage = () => {
    switch (instantiatePermission) {
      case AccessConfigPermission.ANY_OF_ADDRESSES:
        return address && permissionAddresses.includes(address)
          ? "You are included in designated addresses to instantiate"
          : "This code can be instantiate by designated addresses";
      case AccessConfigPermission.EVERYBODY:
        return "Everyone can instantiate contract with this code";
      case AccessConfigPermission.NOBODY:
        return "You can instantiate contract with this code through proposal only";
      case AccessConfigPermission.ONLY_ADDRESS:
        return address && permissionAddresses.includes(address)
          ? "You are designated to instantiate contract from this code"
          : `This code can only be instantiated by ${truncate(
              permissionAddresses[0]
            )}`;
      default:
        return "Valid Code ID";
    }
  };
  const getColor = () =>
    resolvePermission(address, instantiatePermission, permissionAddresses)
      ? "success.main"
      : "text.dark";

  return { message: getMessage(), messageColor: getColor() };
};
