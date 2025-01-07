import type { Coin } from "@cosmjs/stargate";

export enum AttachFundsType {
  ATTACH_FUNDS_JSON = "JSON",
  ATTACH_FUNDS_NULL = "NULL",
  ATTACH_FUNDS_SELECT = "SELECT",
}

export interface AttachFundsState {
  assetsJsonStr: string;
  assetsSelect: Coin[];
  attachFundsOption: AttachFundsType;
}
