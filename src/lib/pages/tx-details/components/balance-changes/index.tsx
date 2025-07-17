import type {
  Metadata,
  BalanceChanges as TotalBalanceChanges,
} from "@initia/tx-decoder";

import { Stack, TableContainer } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";

import { BalanceChangesMobileCard } from "./balance-changes-mobile-card";
import { BalanceChangesTableHeader } from "./balance-changes-table-header";
import { BalanceChangesTableRow } from "./balance-changes-table-row";

interface BalanceChangesProps {
  metadata?: Metadata;
  totalBalanceChanges: TotalBalanceChanges;
}

export const BalanceChanges = ({
  metadata,
  totalBalanceChanges,
}: BalanceChangesProps) => {
  const isMobile = useMobile();
  const templateColumns = "230px 1fr";

  const addresses = Array.from(
    new Set([
      ...Object.keys(totalBalanceChanges.ft),
      ...Object.keys(totalBalanceChanges.object),
    ])
  );

  const mapped = addresses.map((address) => {
    const ftChange = totalBalanceChanges.ft[address];
    const objectChange = totalBalanceChanges.object[address];

    return {
      address,
      ftChange,
      objectChange,
    };
  });

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
  ) : mapped.length ? (
    <TableContainer>
      <BalanceChangesTableHeader templateColumns={templateColumns} />
      <Stack>
        {mapped.map(({ address, ftChange, objectChange }) => (
          <BalanceChangesTableRow
            key={address}
            address={address}
            ftChange={ftChange}
            metadata={metadata}
            objectChange={objectChange}
            templateColumns={templateColumns}
          />
        ))}
      </Stack>
    </TableContainer>
  ) : (
    <EmptyState
      alignItems="flex-start"
      message="No balances were changed by this transaction."
      my={0}
      py={6}
      textVariant="body2"
    />
  );
};
