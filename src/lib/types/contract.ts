import type { ContractLocalInfo } from "lib/stores/contract";
import type { Addr, Option } from "lib/types";

export enum RemarkOperation {
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS",
}

type RemarkType = "governance" | "transaction";

export interface ContractHistoryRemark {
  operation: RemarkOperation;
  type: RemarkType;
  value: string | number;
}

export interface ContractInfo extends ContractLocalInfo {
  admin: Option<Addr>;
  latestUpdater: Option<Addr>;
  latestUpdated: Option<Date>;
  remark: Option<ContractHistoryRemark>;
}

export interface ContractMigrationHistory {
  codeId: number;
  codeName?: string;
  sender: Addr;
  height: number;
  timestamp: Date;
  remark: ContractHistoryRemark;
  uploader: Addr;
  cw2Contract: Option<string | null>;
  cw2Version: Option<string | null>;
}
