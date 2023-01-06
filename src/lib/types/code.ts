import type { HumanAddr, ContractAddr } from "lib/types";

export interface CodeInfo {
  id: number;
  description?: string;
  contracts: number;
  uploader: string;
}

interface CodeProposal {
  proposalId: number;
  height: number;
  created: Date | undefined;
}

enum InstantiatePermission {
  EVERYBODY = "EVERYBODY",
  ANY_OF_ADDRESSES = "ANY_OF_ADDRESSES",
  NOBODY = "NOBODY",
}

export interface CodeDetails {
  chainId: string | undefined;
  codeId: number;
  uploader: ContractAddr | HumanAddr;
  hash: string | undefined;
  height: number;
  created: Date | undefined;
  proposal: CodeProposal | undefined;
  instantiatePermission: InstantiatePermission;
  permissionAddresses: (HumanAddr | ContractAddr)[];
}
