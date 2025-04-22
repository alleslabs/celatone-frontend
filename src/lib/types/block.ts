import type { Nullable, Nullish } from "./common";
import type { Validator } from "./validator";

export interface Block {
  hash: string;
  height: number;
  proposer: Nullable<Validator>;
  timestamp: Date;
  txCount: number;
}

export interface BlockData extends Omit<Block, "txCount"> {
  gasLimit: Nullish<number>;
  gasUsed: Nullish<number>;
}
