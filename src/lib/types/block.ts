import type { Nullable, Nullish } from "./common";
import type { Validator } from "./validator";

export interface Block {
  hash: string;
  height: number;
  timestamp: Date;
  txCount: number;
  proposer: Nullable<Validator>;
  proposerAddress?: string; // Base64
}

export interface BlockData extends Omit<Block, "txCount"> {
  gasUsed: Nullish<number>;
  gasLimit: Nullish<number>;
}
