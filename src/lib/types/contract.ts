import type { ContractLocalInfo } from "lib/stores/contract";

import { z } from "zod";

import type { BechAddr } from "./addrs";
import type { Nullable, Option } from "./common";

import { zRemark } from "./tx";

export enum RemarkOperation {
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE",
}

export const zRemarkOperation = z.nativeEnum(RemarkOperation);

export const zContractHistoryRemark = zRemark.extend({
  operation: zRemarkOperation,
});

export type ContractHistoryRemark = z.infer<typeof zContractHistoryRemark>;

export interface ContractInfo extends ContractLocalInfo {
  admin: Option<BechAddr>;
  latestUpdated: Option<Date>;
  latestUpdater: Option<BechAddr>;
  remark: Option<ContractHistoryRemark>;
}

export interface ContractMigrationHistory {
  codeId: number;
  codeName?: string;
  cw2Contract: Nullable<string>;
  cw2Version: Nullable<string>;
  height: Nullable<number>;
  msg?: string;
  remark: Nullable<ContractHistoryRemark>;
  sender: Nullable<BechAddr>;
  timestamp: Nullable<Date>;
  uploader: Nullable<BechAddr>;
}

export enum ContractInteractionTabs {
  Execute = "execute",
  Query = "query",
}
