import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

export interface ContractInstances {
  contractList: Option<ContractInfo[]>;
  count: number;
}
