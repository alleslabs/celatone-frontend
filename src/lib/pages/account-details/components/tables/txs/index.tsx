import { TierSwitcher } from "lib/components/TierSwitcher";

import { TxsTableFull } from "./Full";
import { TxsTableLite } from "./Lite";
import { TxsTableSequencer } from "./Sequencer";
import type { TxsTableProps } from "./types";

export const TxsTable = (props: TxsTableProps) => (
  <TierSwitcher
    full={<TxsTableFull {...props} />}
    lite={<TxsTableLite {...props} />}
    sequencer={<TxsTableSequencer {...props} />}
  />
);
