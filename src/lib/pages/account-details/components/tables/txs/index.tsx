import { TierSwitcher } from "lib/components/TierSwitcher";

import { TxsTableFull } from "./Full";
import { TxsTableLite } from "./Lite";
import type { TxsTableProps } from "./types";

export const TxsTable = (props: TxsTableProps) => (
  <TierSwitcher
    full={<TxsTableFull {...props} />}
    lite={<TxsTableLite {...props} />}
  />
);
