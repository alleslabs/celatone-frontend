import { z } from "zod";

import type { ContractLocalInfo } from "lib/stores/contract";

import type { BechAddr } from "./addrs";
import type { Nullable, Option } from "./common";
import { zRemark } from "./tx";

export enum RemarkOperation {
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS",
}

export const zRemarkOperation = z.nativeEnum(RemarkOperation);

export const zContractHistoryRemark = zRemark.extend({
  operation: zRemarkOperation,
});

export type ContractHistoryRemark = z.infer<typeof zContractHistoryRemark>;

export interface ContractInfo extends ContractLocalInfo {
  admin: Option<BechAddr>;
  latestUpdater: Option<BechAddr>;
  latestUpdated: Option<Date>;
  remark: Option<ContractHistoryRemark>;
}

export interface ContractMigrationHistory {
  codeId: number;
  codeName?: string;
  sender: Nullable<BechAddr>;
  height: Nullable<number>;
  timestamp: Nullable<Date>;
  remark: Nullable<ContractHistoryRemark>;
  uploader: Nullable<BechAddr>;
  cw2Contract: Nullable<string>;
  cw2Version: Nullable<string>;
  msg?: string;
}

export enum ContractInteractionTabs {
  Query = "query",
  Execute = "execute",
}
