import type { ContractInfo } from "lib/stores/contract";

export interface ContractInstances {
  contractList: ContractInfo[] | undefined;
  count: number;
}
