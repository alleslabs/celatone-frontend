import type { Coin } from "@cosmjs/stargate";

import type { Addr } from "lib/types";
import type { MsgBaseDetails } from "lib/utils/tx/types";

export interface MsgSwapExactAmountIn extends MsgBaseDetails {
  routes: { poolId: number; tokenOutDenom: string }[];
  tokenIn: Coin;
  tokenOutMinAmount: string;
  sender: Addr;
}

export interface MsgSwapExactAmountOut extends MsgBaseDetails {
  routes: { poolId: number; tokenInDenom: string }[];
  tokenOut: Coin;
  tokenInMaxAmount: string;
  sender: Addr;
}
