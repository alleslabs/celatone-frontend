import type { Option } from "./common";
import type { ValidatorInfo } from "./validator";

export interface BlockInfo {
  network: string;
  hash: string;
  height: number;
  timestamp: Date;
  txCount: number;
  proposer: ValidatorInfo | null;
}

export interface BlockDetails extends Omit<BlockInfo, "txCount"> {
  gasUsed: Option<number | null>;
  gasLimit: Option<number | null>;
}

export interface LatestBlock {
  height: Option<number>;
  timestamp: Option<Date>;
}

export interface BlockTimeInfo {
  hundred: Date;
  latest: Date;
}
