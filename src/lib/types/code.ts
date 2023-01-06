import type { HumanAddr, ContractAddr } from "lib/types";

export interface CodeInfo {
  id: number;
  description?: string;
  contracts: number;
  uploader: string;
}

export interface CodeInfoInCodeDetail {
  codeId: number;
  uploader: ContractAddr | HumanAddr;
  hash: string | undefined;
  height: number;
  created: Date;
  proposalId: number | undefined;
  instantiatePermission: string;
  access_config_addresses: string[];
}
