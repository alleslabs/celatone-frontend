import { observer } from "mobx-react-lite";

import { useTierConfig } from "lib/app-provider";

import { InstantiatedContractsTableFull } from "./Full";
import { InstantiatedContractsTableLite } from "./Lite";
import type { InstantiatedContractsTableProps } from "./types";

export const InstantiatedContractsTable = observer(
  (props: InstantiatedContractsTableProps) => {
    const isFullTier = useTierConfig() === "full";

    return isFullTier ? (
      <InstantiatedContractsTableFull {...props} />
    ) : (
      <InstantiatedContractsTableLite {...props} />
    );
  }
);
