import type { Nullable, Option } from "./common";
import type { Validator } from "./validator";

export interface Block {
  hash: string;
  height: number;
  timestamp: Date;
  txCount: number;
  proposer: Nullable<Validator>;
}

export interface BlockDetails extends Omit<Block, "txCount"> {
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
