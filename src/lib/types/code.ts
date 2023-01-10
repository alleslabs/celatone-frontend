import type { HumanAddr, ContractAddr, Option } from "lib/types";

export interface CodeInfo {
  id: number;
  description?: string;
  contracts: number;
  uploader: string;
  instantiatePermission: InstantiatePermission;
  permissionAddresses: (HumanAddr | ContractAddr)[];
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
  permissionAddresses: (HumanAddr | ContractAddr)[];
}
