import type { ContractLocalInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

export interface ContractInfo extends ContractLocalInfo {
  instantiated: Date;
  latestUpdator: string;
  latestUpdated: Date;
}

export interface ContractInstances {
  contractList: Option<ContractLocalInfo[]>;
  count: number;
}
