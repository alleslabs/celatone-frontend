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
