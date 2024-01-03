import type { BechAddr, Option, RemarkType, UpgradePolicy } from "lib/types";

interface Remark {
  type: RemarkType;
  value: string;
}

export interface ModuleHistory {
  remark: Remark;
  upgradePolicy: UpgradePolicy;
  height: number;
  timestamp: Date;
  previousPolicy: Option<UpgradePolicy>;
}

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
