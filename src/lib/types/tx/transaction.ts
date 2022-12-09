import type {
  DetailExecute,
  DetailInstantiate,
  DetailSend,
  DetailUpload,
} from "./msg";

export interface Transaction {
  hash: string;
  isSend: boolean;
  isExecute: boolean;
  isInstantiate: boolean;
  isStoreCode: boolean;
  isIbc: boolean;
  messages: Message[];
  success: boolean;
  block: {
    timestamp: string;
  };
}

export interface Message {
  // TODO - Fix message type
  detail: DetailExecute | DetailInstantiate | DetailUpload | DetailSend;
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
