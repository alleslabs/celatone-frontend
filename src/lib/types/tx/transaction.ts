import type { Dayjs } from "dayjs";

import type { ContractAddr, HumanAddr } from "lib/types";

import type {
  DetailClearAdmin,
  DetailExecute,
  DetailInstantiate,
  DetailMigrate,
  DetailSend,
  DetailUpdateAdmin,
  DetailUpload,
} from "./msg";

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

export interface PastTransaction {
  hash: string;
  messages: Message[];
  created: Dayjs;
  success: boolean;
  actionMsgType: ActionMsgType;
  furtherAction: MsgFurtherAction;
  isIbc: boolean;
  isInstantiate: boolean;
}

export interface Message {
  detail:
    | DetailExecute
    | DetailInstantiate
    | DetailUpload
    | DetailSend
    | DetailUpdateAdmin
    | DetailClearAdmin
    | DetailMigrate;

  logs: Logs;
  msg: Msg;
  type: string;
}

interface Logs {
  events: object[];
}

export interface Msg {
  msg: object[];
  contract: string;
}

export interface ExecuteTransaction {
  hash: string;
  messages: Message[];
  sender: ContractAddr | HumanAddr;
  height: number;
  created: Dayjs;
  success: boolean;
}

export interface AllTransaction extends ExecuteTransaction {
  actionMsgType: ActionMsgType;
  isIbc: boolean;
}

export interface Filters {
  isExecute: boolean;
  isInstantiate: boolean;
  isUpload: boolean;
  isIbc: boolean;
  isSend: boolean;
  isMigrate: boolean;
  isUpdateAdmin: boolean;
  isClearAdmin: boolean;
}
