import { TierSwitcher } from "lib/components/TierSwitcher";

import type { TxsTableProps } from "./types";

import { TxsTableFull } from "./full";
import { TxsTableLite } from "./lite";
import { TxsTableSequencer } from "./sequencer";

export const TxsTable = (props: TxsTableProps) => (
  <TierSwitcher
    full={<TxsTableFull {...props} />}
    lite={<TxsTableLite {...props} />}
    sequencer={<TxsTableSequencer {...props} />}
  />
);
