import type { Log } from "@cosmjs/stargate/build/logs";
import { z } from "zod";

import type { Event } from "lib/services/types";
import type { BechAddr, Option, Pubkey } from "lib/types";

export enum ActionMsgType {
  MULTIPLE_ACTION_MSG = "MULTIPLE_ACTION_MSG",
  OTHER_ACTION_MSG = "OTHER_ACTION_MSG",
  SINGLE_ACTION_MSG = "SINGLE_ACTION_MSG",
}

export enum MsgFurtherAction {
  NONE = "NONE",
  REDO = "REDO",
  RESEND = "RESEND",
}

export interface BaseTxFilters {
  isIbc: boolean;
  isSend: boolean;
}

/* Filter for INITIA */
export interface InitiaTxFilters {
  isOpinit: boolean;
}

export interface Message {
  detail?: object;
  log: Option<Log>;
  type: string;
}

export interface MoveTxFilters {
  isMoveExecute: boolean;
  isMovePublish: boolean;
  isMoveScript: boolean;
  isMoveUpgrade: boolean;
}

export interface Msg {
  contract: string;
  msg: object[];
}

export type PoolTxFilter =
  | "is_all"
  | "is_bond"
  | "is_clp"
  | "is_collect"
  | "is_lp"
  | "is_migrate"
  | "is_superfluid"
  | "is_swap";
export interface Transaction {
  actionMsgType: ActionMsgType;
  created: Date;
  events?: Event[];
  furtherAction: MsgFurtherAction;
  hash: string;
  height: number;
  isEvm: boolean;
  isIbc: boolean;
  isInstantiate: boolean;
  isOpinit: boolean;
  isSigner: boolean;
  messages: Message[];
  sender: BechAddr;
  success: boolean;
}

export type TransactionWithSignerPubkey = Omit<Transaction, "sender"> & {
  signerPubkey: Pubkey;
};

export interface TxFilters
  extends BaseTxFilters,
    InitiaTxFilters,
    MoveTxFilters,
    WasmTxFilters {}

export interface WasmTxFilters {
  isClearAdmin: boolean;
  isExecute: boolean;
  isInstantiate: boolean;
  isMigrate: boolean;
  isStoreCode: boolean;
  isUpdateAdmin: boolean;
}

export const zRemarkType = z.enum(["genesis", "governance", "transaction"]);
export type RemarkType = z.infer<typeof zRemarkType>;

export const zRemark = z.object({
  type: zRemarkType.nullable(),
  value: z.union([z.string(), z.number()]).optional(),
});
export type Remark = z.infer<typeof zRemark>;
