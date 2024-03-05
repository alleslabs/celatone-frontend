import type { CodeLocalInfo } from "lib/stores/code";
import type { BechAddr, Option, Nullable } from "lib/types";

export enum AccessConfigPermission {
  EVERYBODY = "Everybody",
  ANY_OF_ADDRESSES = "AnyOfAddresses",
  NOBODY = "Nobody",
  ONLY_ADDRESS = "OnlyAddress",
  // Added for case handling
  UNKNOWN = "Unknown",
}

export type PermissionAddresses = BechAddr[];

export interface CodeInfo extends CodeLocalInfo {
  contractCount: Option<number>;
  instantiatePermission: AccessConfigPermission;
  permissionAddresses: PermissionAddresses;
  cw2Contract: Option<Nullable<string>>;
  cw2Version: Option<Nullable<string>>;
  isSaved?: boolean;
}
