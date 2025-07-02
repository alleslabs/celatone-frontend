import type { BalanceChanges as TotalBalanceChanges } from "@initia/tx-decoder";

import { Stack, TableContainer } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { MobileTableContainer } from "lib/components/table";

import { BalanceChangesMobileCard } from "./balance-changes-mobile-card";
import { BalanceChangesTableHeader } from "./balance-changes-table-header";
import { BalanceChangesTableRow } from "./balance-changes-table-row";

interface BalanceChangesProps {
  totalBalanceChanges: TotalBalanceChanges;
}

export const BalanceChanges = ({
  totalBalanceChanges,
}: BalanceChangesProps) => {
  const isMobile = useMobile();
  const templateColumns = "230px 1fr";

  return isMobile ? (
    <MobileTableContainer>
      {Object.entries(totalBalanceChanges.ft).map(([address, changes]) => (
        <BalanceChangesMobileCard
          key={address}
          address={address}
          changes={changes}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <BalanceChangesTableHeader templateColumns={templateColumns} />
      <Stack>
        {Object.entries(totalBalanceChanges.ft).map(([address, changes]) => (
          <BalanceChangesTableRow
            key={address}
            address={address}
            changes={changes}
            templateColumns={templateColumns}
          />
        ))}
      </Stack>
    </TableContainer>
  );
};
