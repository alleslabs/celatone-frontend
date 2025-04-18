import type { BechAddr32, Option } from "lib/types";

import { TierSwitcher } from "lib/components/TierSwitcher";

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
  refetchCount,
  scrollComponentId,
  totalData,
}: MigrationTableProps) => (
  <TierSwitcher
    full={
      <MigrationTableFull
        contractAddress={contractAddress}
        refetchCount={refetchCount}
        scrollComponentId={scrollComponentId}
        totalData={totalData}
      />
    }
    lite={<MigrationTableLite contractAddress={contractAddress} />}
  />
);
