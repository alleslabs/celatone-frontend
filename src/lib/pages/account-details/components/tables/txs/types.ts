import type { BechAddr } from "lib/types";

export interface TxsTableProps {
  address: BechAddr;
  scrollComponentId: string;
  refetchCount: () => void;
  onViewMore?: () => void;
}
