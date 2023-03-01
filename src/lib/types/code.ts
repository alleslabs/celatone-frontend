import type { CodeLocalInfo } from "lib/stores/code";
import type { Option, Addr } from "lib/types";

export enum InstantiatePermission {
  EVERYBODY = "Everybody",
  ANY_OF_ADDRESSES = "AnyOfAddresses",
  NOBODY = "Nobody",
  ONLY_ADDRESS = "OnlyAddress",
  // Added for case handling
  UNKNOWN = "Unknown",
}

export type PermissionAddresses = Addr | Addr[];

export interface CodeInfo extends CodeLocalInfo {
  contractCount: Option<number>;
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
  isSaved?: boolean;
}

interface CodeProposal {
  proposalId: number;
  height: Option<number>;
  created: Option<Date>;
}

export interface CodeData {
  codeId: number;
  uploader: Addr;
  hash: Option<string>;
  height: Option<number>;
  created: Option<Date>;
  proposal: Option<CodeProposal>;
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
}

export interface PublicCodeData {
  contracts: number;
  description: string;
  id: number;
  instantiatePermission: string;
  name: string;
  permissionAddresses: string[];
  slug: string;
  uploader: string;
  verified: boolean;
}
