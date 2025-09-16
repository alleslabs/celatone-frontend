import type {
  Metadata,
  BalanceChanges as TotalBalanceChanges,
} from "@initia/tx-decoder";

import { Stack, TableContainer } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";
import { useMemo } from "react";

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

  const addresses = useMemo(
    () =>
      Array.from(
        new Set([
          ...Object.keys(totalBalanceChanges.ft),
          ...Object.keys(totalBalanceChanges.object),
        ])
      ),
    [totalBalanceChanges.ft, totalBalanceChanges.object]
  );

  const mapped = useMemo(
    () =>
      addresses
        .map((address) => {
          const ftChange = totalBalanceChanges.ft[address];
          const ftChangeEntries = Object.entries(ftChange ?? {}).filter(
            ([, amount]) => amount !== "0"
          );

          const objectChange = totalBalanceChanges.object[address];
          const objectChangeEntries = Object.entries(objectChange ?? {}).filter(
            ([, amount]) => amount !== "0"
          );

          if (ftChangeEntries.length + objectChangeEntries.length === 0)
            return null;

          return {
            address,
            ftChangeEntries,
            objectChangeEntries,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [addresses, totalBalanceChanges.ft, totalBalanceChanges.object]
  );

  if (!mapped.length)
    return (
      <EmptyState
        alignItems="flex-start"
        message="No balances were changed by this transaction."
        my={0}
        py={6}
        textVariant="body2"
      />
    );

  if (isMobile) {
    return (
      <MobileTableContainer>
        {mapped.map(({ address, ftChangeEntries, objectChangeEntries }) => (
          <BalanceChangesMobileCard
            key={address}
            address={address}
            ftChangeEntries={ftChangeEntries}
            metadata={metadata}
            objectChangeEntries={objectChangeEntries}
          />
        ))}
      </MobileTableContainer>
    );
  }

  return (
    <TableContainer>
      <BalanceChangesTableHeader templateColumns={templateColumns} />
      <Stack>
        {mapped.map(({ address, ftChangeEntries, objectChangeEntries }) => (
          <BalanceChangesTableRow
            key={address}
            address={address}
            ftChangeEntries={ftChangeEntries}
            metadata={metadata}
            objectChangeEntries={objectChangeEntries}
            templateColumns={templateColumns}
          />
        ))}
      </Stack>
    </TableContainer>
  );
};
