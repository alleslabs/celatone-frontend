import { TierSwitcher } from "lib/components/TierSwitcher";
import type { BechAddr32, Option } from "lib/types";

import { MigrationTableFull } from "./MigrationTableFull";
import { MigrationTableLite } from "./MigrationTableLite";

interface MigrationTableProps {
  contractAddress: BechAddr32;
  refetchCount: () => void;
  scrollComponentId: string;
  totalData: Option<number>;
}

export const MigrationTable = ({
  contractAddress,
  refetchCount,
  scrollComponentId,
  totalData,
}: MigrationTableProps) => (
  <TierSwitcher
    full={
      <MigrationTableFull
        contractAddress={contractAddress}
        scrollComponentId={scrollComponentId}
        totalData={totalData}
        refetchCount={refetchCount}
      />
    }
    lite={<MigrationTableLite contractAddress={contractAddress} />}
  />
);
