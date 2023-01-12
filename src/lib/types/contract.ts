import type { ContractInfo } from "lib/stores/contract";
import type { ContractAddr, HumanAddr, Option } from "lib/types";

export interface ContractInstances {
  contractList: Option<ContractInfo[]>;
  count: number;
}

export enum RemarkOperation {
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS",
}

type RemarkType = "governance" | "transaction";

interface MigrationRemark {
  operation: RemarkOperation;
  type: RemarkType;
  value: string;
}
export interface ContractMigrationHistory {
  codeId: number;
  codeDescription?: string;
  migratedBy: HumanAddr | ContractAddr;
  height: number;
  timestamp: Date;
  remark: MigrationRemark;
}
