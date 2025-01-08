import type { BechAddr, Option } from "lib/types";

export interface InstantiatedContractsTableProps {
  address: BechAddr;
  onViewMore?: () => void;
  refetchCount: () => void;
  scrollComponentId: string;
  totalData: Option<number>;
}
