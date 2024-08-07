import { TierSwitcher } from "lib/components/TierSwitcher";
import type { BechAddr32, Option } from "lib/types";

import { MigrationTableFull } from "./MigrationTableFull";
import { MigrationTableLite } from "./MigrationTableLite";

interface MigrationTableProps {
  contractAddress: BechAddr32;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
}

export const MigrationTable = ({
  contractAddress,
  scrollComponentId,
  totalData,
  refetchCount,
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
