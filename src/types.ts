import type { AppConstants } from "lib/app-provider/types";
import type { ChainGas, MsgType } from "lib/types";

export interface CelatoneConstants extends AppConstants {
  fallbackGasRegistry: Record<string, ChainGas>;
  endpointRegistry: Record<string, string>;
  maxFileSize: number;
  directoryDefault: {
    instantiatedList: string;
    savedList: string;
    defaultAddress: string;
  };
  msgTypeUrl: { [key in MsgType]: string };
}
