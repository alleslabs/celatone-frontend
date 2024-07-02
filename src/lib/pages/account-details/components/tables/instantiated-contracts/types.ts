import type { BechAddr, Option } from "lib/types";

export interface InstantiatedContractsTableProps {
  address: BechAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}
