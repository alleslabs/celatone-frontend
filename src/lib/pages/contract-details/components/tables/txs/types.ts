import type { BechAddr } from "lib/types";

export interface TxsTableProps {
  contractAddress: BechAddr;
  onViewMore?: () => void;
  refetchCount?: () => void;
  scrollComponentId?: string;
  totalData?: number;
}
