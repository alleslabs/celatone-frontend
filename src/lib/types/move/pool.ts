import type Big from "big.js";

import type { HexAddr } from "../addrs";
import type { Option } from "../common";
import type { Token, U, USD } from "../currency";

export type MovePoolInfos = Record<
  string,
  {
    coinA: {
      amountAPerShare: U<Token<Big>>;
      denom: string;
      metadata: HexAddr;
      precision: Option<number>;
      symbol: Option<string>;
    };
    coinB: {
      amountBPerShare: U<Token<Big>>;
      denom: string;
      metadata: HexAddr;
      precision: Option<number>;
      symbol: Option<string>;
    };
    logo: Option<string>[];
    lpPricePerPShare: Option<USD<Big>>;
    precision: number;
  }
>;
