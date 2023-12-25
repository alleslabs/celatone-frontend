import type Big from "big.js";

import type { HexAddr } from "../addrs";
import type { Option } from "../common";
import type { Token, U, USD } from "../currency";

export type MovePoolInfos = Record<
  string,
  {
    coinA: {
      metadata: HexAddr;
      denom: string;
      amountAPerShare: U<Token<Big>>;
      precision: Option<number>;
      symbol: Option<string>;
    };
    coinB: {
      metadata: HexAddr;
      denom: string;
      amountBPerShare: U<Token<Big>>;
      precision: Option<number>;
      symbol: Option<string>;
    };
    lpPricePerPShare: Option<USD<Big>>;
    precision: number;
    logo: Option<string>[];
  }
>;
