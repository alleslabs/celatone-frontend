import type { Addr } from "lib/types";

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
  detail: object;
  logs: Logs;
  type: string;
}

interface Logs {
  events: object[];
}

export interface Msg {
  msg: object[];
  contract: string;
}

export interface Transaction {
  hash: string;
  messages: Message[];
  sender: Addr;
  isSigner: boolean;
  height: number;
  created: Date;
  success: boolean;
  actionMsgType: ActionMsgType;
  furtherAction: MsgFurtherAction;
  isIbc: boolean;
  isInstantiate: boolean;
}

export interface TxFilters {
  isExecute: boolean;
  isInstantiate: boolean;
  isUpload: boolean;
  isIbc: boolean;
  isSend: boolean;
  isMigrate: boolean;
  isUpdateAdmin: boolean;
  isClearAdmin: boolean;
}
