import type { HexAddr } from "../addrs";
import type { Option } from "../common";
import type { USD } from "../currency";

export type MovePoolInfos = Record<
  string,
  {
    coinA: {
      metadata: HexAddr;
      denom: string;
      precision: number;
      amountAPerShare: Big;
      symbol: Option<string>;
    };
    coinB: {
      metadata: HexAddr;
      denom: string;
      precision: number;
      amountBPerShare: Big;
      symbol: Option<string>;
    };
    lpPricePerShare: Option<USD<Big>>;
    precision: number;
    logo: Option<string>[];
  }
>;
