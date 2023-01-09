import type { HumanAddr, ContractAddr, Option } from "lib/types";

export interface CodeInfo {
  id: number;
  description?: string;
  contracts: number;
  uploader: string;
}

interface CodeProposal {
  proposalId: number;
  height: Option<number>;
  created: Date;
}

enum InstantiatePermission {
  EVERYBODY = "EVERYBODY",
  ANY_OF_ADDRESSES = "ANY_OF_ADDRESSES",
  NOBODY = "NOBODY",
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
