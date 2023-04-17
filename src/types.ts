import type { AppConstants } from "lib/app-provider/types";
import type { ContractAddr, HumanAddr } from "lib/types";

export interface CelatoneContractAddress {
  example: ContractAddr;
}

export interface CelatoneHumanAddress {
  example: HumanAddr;
}
export interface CelatoneConstants extends AppConstants {
  maxFileSize: number;
}
