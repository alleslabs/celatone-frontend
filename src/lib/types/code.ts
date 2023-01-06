import type { HumanAddr, ContractAddr } from "lib/types";

export interface CodeInfo {
  id: number;
  description?: string;
  contracts: number;
  uploader: string;
}

interface Proposal {
  proposalId: number;
  height: number;
  created: Date;
}
export interface CodeInfoInCodeDetail {
  codeId: number;
  uploader: ContractAddr | HumanAddr;
  hash: string | undefined;
  height: number;
  created: Date;
  proposal: Proposal | undefined;
  instantiatePermission: string;
  access_config_addresses: string[];
}
