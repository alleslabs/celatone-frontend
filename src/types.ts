import type { AppConstants } from "lib/app-provider/types";
import type { MsgType } from "lib/types";

export interface CelatoneConstants extends AppConstants {
  lcdEndpoint: Record<string, string>;
  maxFileSize: number;
  msgTypeUrl: { [key in MsgType]: string };
}
