import type { AppConstants } from "lib/app-provider/types";
import type { ChainGasPrice, MsgType } from "lib/types";

export interface CelatoneConstants extends AppConstants {
  fallbackGasPrices: Record<string, ChainGasPrice>;
  endpointRegistry: Record<string, string>;
  maxFileSize: number;
  directoryDefault: {
    instantiatedList: string;
    savedList: string;
    defaultAddress: string;
  };
  msgTypeUrl: { [key in MsgType]: string };
}
