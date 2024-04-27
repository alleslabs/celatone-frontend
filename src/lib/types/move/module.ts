import type { BechAddr } from "lib/types";

export interface ModuleInfo {
  // NOTE: can also be an ica or a contract
  address: BechAddr;
  name: string;
  functions?: {
    view: number;
    execute: number;
  };
  height?: number;
  latestUpdated?: Date;
  isRepublished?: boolean;
  isVerified?: boolean;
}
