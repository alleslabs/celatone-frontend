import type { Coin } from "@cosmjs/stargate";

export enum AttachFundsType {
  ATTACH_FUNDS_SELECT = "SELECT",
  ATTACH_FUNDS_JSON = "JSON",
  ATTACH_FUNDS_NULL = "NULL",
}

export interface AttachFundsState {
  assetsSelect: Coin[];
  assetsJsonStr: string;
  attachFundsOption: AttachFundsType;
}
