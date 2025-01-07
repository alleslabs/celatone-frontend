import { TierSwitcher } from "lib/components/TierSwitcher";

import { TxsTableFull } from "./full";
import { TxsTableLite } from "./lite";
import { TxsTableSequencer } from "./sequencer";
import type { TxsTableProps } from "./types";

export const TxsTable = (props: TxsTableProps) => (
  <TierSwitcher
    full={<TxsTableFull {...props} />}
    lite={<TxsTableLite {...props} />}
    sequencer={<TxsTableSequencer {...props} />}
  />
);
