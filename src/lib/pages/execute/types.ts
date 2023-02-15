import type { Coin } from "@cosmjs/stargate";

import type { ContractAddr } from "lib/types";

export interface ExecutePageState {
  contractAddress: ContractAddr;
  initialMsg: string;
  assets: Coin[];
}
