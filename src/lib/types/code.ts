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
export interface CodeDetails {
  chainId: string | undefined;
  codeId: number;
  uploader: ContractAddr | HumanAddr;
  hash: string | undefined;
  height: number;
  created: Date | undefined;
  proposal: CodeProposal | undefined;
  instantiatePermission: string;
  access_config_addresses: string[];
}
