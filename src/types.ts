import type { AppConstants } from "lib/app-provider/types";
import type { ContractAddr, MsgType } from "lib/types";

export interface CelatoneContractAddress {
  example: ContractAddr;
}
export interface CelatoneConstants extends AppConstants {
  maxFileSize: number;
  msgTypeUrl: { [key in MsgType]: string };
}
