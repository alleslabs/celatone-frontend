import type { CodeLocalInfo } from "lib/stores/code";
import type { HumanAddr, ContractAddr, Option } from "lib/types";

export enum InstantiatePermission {
  EVERYBODY = "Everybody",
  ANY_OF_ADDRESSES = "AnyOfAddresses",
  NOBODY = "Nobody",
  ONLY_ADDRESS = "OnlyAddress",
  // Added for case handling
  UNKNOWN = "Unknown",
}

export type PermissionAddresses =
  | HumanAddr
  | ContractAddr
  | (HumanAddr | ContractAddr)[];

export interface CodeInfo extends CodeLocalInfo {
  contracts: number;
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
  isSaved?: boolean;
}

interface CodeProposal {
  proposalId: number;
  height: Option<number>;
  created: Date;
}

export interface CodeDetails {
  chainId: Option<string>;
  codeId: number;
  uploader: ContractAddr | HumanAddr;
  hash: Option<string>;
  height: Option<number>;
  created: Date;
  proposal: Option<CodeProposal>;
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
}
