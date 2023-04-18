import type { Option } from "./common";

export interface BlockInfo {
  network: string;
  hash: string;
  height: number;
  timestamp: Date;
  txCount: number;
}

export interface BlockDetails extends Omit<BlockInfo, "txCount"> {
  gasUsed: Option<number | null>;
  gasLimit: Option<number | null>;
}
