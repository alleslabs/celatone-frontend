import { z } from "zod";

import type { ContractLocalInfo } from "lib/stores/contract";

import type { Addr } from "./addrs";
import type { Nullable, Option } from "./common";
import { zRemarkType } from "./tx";

export enum RemarkOperation {
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE",
  CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS",
}

export const zContractHistoryRemark = z.object({
  operation: z.nativeEnum(RemarkOperation),
  type: zRemarkType,
  value: z.union([z.string(), z.number()]),
});

export type ContractHistoryRemark = z.infer<typeof zContractHistoryRemark>;

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
  cw2Contract: Nullable<string>;
  cw2Version: Nullable<string>;
}
