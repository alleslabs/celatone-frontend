import { useTierConfig } from "lib/app-provider";

import { TxsTableFull } from "./Full";
import { TxsTableLite } from "./Lite";
import type { TxsTableProps } from "./types";

export const TxsTable = (props: TxsTableProps) => {
  const isFullTier = useTierConfig() === "full";

  return isFullTier ? <TxsTableFull {...props} /> : <TxsTableLite {...props} />;
};
