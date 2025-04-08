import { TierSwitcher } from "lib/components/TierSwitcher";
import { observer } from "mobx-react-lite";

import type { InstantiatedContractsTableProps } from "./types";

import { InstantiatedContractsTableFull } from "./Full";
import { InstantiatedContractsTableLite } from "./Lite";

export const InstantiatedContractsTable = observer(
  (props: InstantiatedContractsTableProps) => (
    <TierSwitcher
      full={<InstantiatedContractsTableFull {...props} />}
      lite={<InstantiatedContractsTableLite {...props} />}
    />
  )
);
