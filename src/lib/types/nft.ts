import type { Remark } from "./tx";

// NOTE: on MOVE, the same for both collection and nft
export interface MutateEvent {
  oldValue: string;
  newValue: string;
  mutatedFieldName: string;
  remark: Remark;
  timestamp: Date;
}

export interface Trait {
  traitType: string;
  displayType?: string;
  value: string | number;
}
