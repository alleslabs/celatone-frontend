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

export interface Transaction {
  hash: string;
  isSend?: boolean;
  isExecute?: boolean;
  isInstantiate?: boolean;
  isStoreCode?: boolean;
  isIbc?: boolean;
  messages: Message[];
  success: boolean;
  account?: {
    address: string;
  };
  block: {
    height?: number;
    timestamp: string;
  };
}

export interface Message {
  // TODO - Fix message type
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
  created: Date;
  success: boolean;
}

export enum ActionMsgType {
  SINGLEACTIONMSG = "SINGLEACTIONMSG",
  MULTIPLEACTIONMSG = "MULTIPLEACTIONMSG",
  OTHERACTIONMSG = "OTHERACTIONMSG",
}
export interface AllTransaction extends ExecuteTransaction {
  actionMsgType: ActionMsgType;
  isIbc: boolean;
}
