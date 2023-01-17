import type { ContractAddr, HumanAddr, Option } from "lib/types";

export interface MigratePageState {
  isValid: boolean;
  contractAddress: ContractAddr;
  admin: Option<ContractAddr | HumanAddr>;
  codeId: Option<number>;
}
