import type { Option, RemarkType, UpgradePolicy } from "lib/types";

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

/* recent modules */
export interface RecentModule {
  address: string;
  block: {
    height: number;
    timestamp: string;
  };
  is_republish: boolean;
  is_verify: boolean;
  name: string;
}
