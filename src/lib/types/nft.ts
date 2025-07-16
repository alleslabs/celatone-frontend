import type { Remark } from "./tx";

// NOTE: on MOVE, the same for both collection and nft
export interface MutateEvent {
  mutatedFieldName: string;
  newValue: string;
  oldValue: string;
  remark: Remark;
  timestamp: Date;
}

export interface Trait {
  displayType?: string;
  traitType: string;
  value: boolean | number | string;
}
