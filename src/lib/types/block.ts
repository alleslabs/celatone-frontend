import type { Nullable, Option } from "./common";
import type { ValidatorInfo } from "./validator";

export interface BlockInfo {
  network: string;
  hash: string;
  height: number;
  timestamp: Date;
  txCount: number;
  proposer: Nullable<ValidatorInfo>;
}

export interface BlockDetails extends Omit<BlockInfo, "txCount"> {
  gasUsed: Option<Nullable<number>>;
  gasLimit: Option<Nullable<number>>;
}

export interface LatestBlock {
  height: Option<number>;
  timestamp: Option<Date>;
}

export interface BlockTimeInfo {
  hundred: Date;
  latest: Date;
}
