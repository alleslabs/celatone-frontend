import type { ContractInfo } from "lib/stores/contract";
import type { ContractAddr } from "lib/types";

export interface ContractInstance {
  localContractInfo: ContractInfo | undefined;
  contractAddress: ContractAddr;
  instantiator: string;
  label: string;
  created: Date;
}

export interface ContractInstances {
  contractList: ContractInstance[] | undefined;
  count: number;
}
