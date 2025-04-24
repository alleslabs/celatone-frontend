import type { CodeLocalInfo } from "lib/stores/code";
import type { BechAddr, Nullable, Option } from "lib/types";

export enum AccessConfigPermission {
  ANY_OF_ADDRESSES = "AnyOfAddresses",
  EVERYBODY = "Everybody",
  NOBODY = "Nobody",
  ONLY_ADDRESS = "OnlyAddress",
  // Added for case handling
  UNKNOWN = "Unknown",
}

export type PermissionAddresses = BechAddr[];

export interface CodeInfo extends CodeLocalInfo {
  contractCount: Option<number>;
  cw2Contract: Option<Nullable<string>>;
  cw2Version: Option<Nullable<string>>;
  instantiatePermission: AccessConfigPermission;
  isSaved?: boolean;
  permissionAddresses: PermissionAddresses;
}
