import type { AppConstants } from "lib/app-provider/types";
import type { ContractAddr } from "lib/types";

export interface CelatoneContractAddress {
  example: ContractAddr;
}
export interface CelatoneConstants extends AppConstants {
  lcdEndpoint: Record<string, string>;
  maxFileSize: number;
}
