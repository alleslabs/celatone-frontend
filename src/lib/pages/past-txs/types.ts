import type { Option, TxFilters } from "lib/types";

export interface PastTxsState {
  search: string;
  filters: TxFilters;
  isSigner: Option<boolean>;
}
