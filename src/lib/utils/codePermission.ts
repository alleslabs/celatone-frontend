import type { Addr, PermissionAddresses } from "lib/types";
import { InstantiatePermission } from "lib/types";
import { truncate } from "lib/utils";

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
