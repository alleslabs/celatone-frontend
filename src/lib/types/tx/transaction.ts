import type { Log } from "@cosmjs/stargate/build/logs";
import { z } from "zod";

import type { Event } from "lib/services/types";
import type { BechAddr, Option, Pubkey } from "lib/types";

export enum ActionMsgType {
  SINGLE_ACTION_MSG = "SINGLE_ACTION_MSG",
  MULTIPLE_ACTION_MSG = "MULTIPLE_ACTION_MSG",
  OTHER_ACTION_MSG = "OTHER_ACTION_MSG",
}

export enum MsgFurtherAction {
  REDO = "REDO",
  RESEND = "RESEND",
  NONE = "NONE",
}

export interface Message {
  detail?: object;
  log: Option<Log>;
  type: string;
}

export interface Msg {
  msg: object[];
  contract: string;
}

export interface Transaction {
  hash: string;
  messages: Message[];
  sender: BechAddr;
  isSigner: boolean;
  height: number;
  created: Date;
  success: boolean;
  actionMsgType: ActionMsgType;
  furtherAction: MsgFurtherAction;
  isIbc: boolean;
  isInstantiate: boolean;
  isOpinit: boolean;
  events?: Event[];
}

export type TransactionWithSignerPubkey = Omit<Transaction, "sender"> & {
  signerPubkey: Pubkey;
};

/* Filter for INITIA */
export interface InitiaTxFilters {
  isOpinit: boolean;
}

export interface BaseTxFilters {
  isSend: boolean;
  isIbc: boolean;
}
export interface WasmTxFilters {
  isStoreCode: boolean;
  isInstantiate: boolean;
  isExecute: boolean;
  isMigrate: boolean;
  isUpdateAdmin: boolean;
  isClearAdmin: boolean;
}

export interface MoveTxFilters {
  isMovePublish: boolean;
  isMoveUpgrade: boolean;
  isMoveExecute: boolean;
  isMoveScript: boolean;
}

export interface TxFilters
  extends BaseTxFilters,
    WasmTxFilters,
    MoveTxFilters,
    InitiaTxFilters {}

export type PoolTxFilter =
  | "is_all"
  | "is_swap"
  | "is_lp"
  | "is_bond"
  | "is_superfluid"
  | "is_clp"
  | "is_collect"
  | "is_migrate";

export const zRemarkType = z.enum(["genesis", "governance", "transaction"]);
export type RemarkType = z.infer<typeof zRemarkType>;

export const zRemark = z.object({
  type: zRemarkType.nullable(),
  value: z.union([z.string(), z.number()]).optional(),
});
export type Remark = z.infer<typeof zRemark>;
