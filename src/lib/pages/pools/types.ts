import type { PoolTypeFilter } from "lib/types";

export interface PoolFilterState {
  keyword: string;
  poolTypeValue: PoolTypeFilter;
  isSuperfluidOnly: boolean;
}
