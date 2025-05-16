import type { BechAddr32, Option } from "lib/types";

export interface TxsTableProps {
  contractAddress: BechAddr32;
  refetchCount: () => void;
  scrollComponentId: string;
  totalData: Option<number>;
}
