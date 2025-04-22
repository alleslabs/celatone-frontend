import type { BechAddr } from "lib/types";

export interface TxsTableProps {
  address: BechAddr;
  onViewMore?: () => void;
  refetchCount: () => void;
  scrollComponentId: string;
}
