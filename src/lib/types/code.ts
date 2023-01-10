import type { HumanAddr, ContractAddr, Option } from "lib/types";

export type PermissionAddresses =
  | HumanAddr
  | ContractAddr
  | (HumanAddr | ContractAddr)[];

export interface CodeInfo {
  id: number;
  description?: string;
  contracts: number;
  uploader: string;
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
}

interface CodeProposal {
  proposalId: number;
  height: Option<number>;
  created: Date;
}

export enum InstantiatePermission {
  EVERYBODY = "Everybody",
  ANY_OF_ADDRESSES = "AnyOfAddresses",
  NOBODY = "Nobody",
  ONLY_ADDRESS = "OnlyAddress",
  // Added for case handling
  UNKNOWN = "Unknown",
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
