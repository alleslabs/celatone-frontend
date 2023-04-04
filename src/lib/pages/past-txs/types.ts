import type { Option, TxFilters } from "lib/types";

export interface PastTxsState {
  search: string;
  filters: TxFilters;
  relation: Option<boolean>;
}
