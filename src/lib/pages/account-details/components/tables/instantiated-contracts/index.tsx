import { observer } from "mobx-react-lite";

import { TierSwitcher } from "lib/components/TierSwitcher";

import { InstantiatedContractsTableFull } from "./Full";
import { InstantiatedContractsTableLite } from "./Lite";
import type { InstantiatedContractsTableProps } from "./types";

export const InstantiatedContractsTable = observer(
  (props: InstantiatedContractsTableProps) => (
    <TierSwitcher
      full={<InstantiatedContractsTableFull {...props} />}
      lite={<InstantiatedContractsTableLite {...props} />}
    />
  )
);
