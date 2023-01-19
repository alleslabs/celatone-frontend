import type { ContractAddr, HumanAddr, Option } from "lib/types";

type MigrateStep = 1.1 | 1.2 | 2;

export interface MigratePageState {
  migrateStep: MigrateStep;
  contractAddress: ContractAddr;
  admin: Option<ContractAddr | HumanAddr>;
  codeId: Option<number>;
}
