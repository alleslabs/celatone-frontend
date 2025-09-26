import type {
  Metadata,
  MoveBalanceChanges,
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

interface MoveBalanceChangesComponentProps {
  metadata?: Metadata;
  moveBalanceChanges: MoveBalanceChanges;
}

export const MoveBalanceChangesComponent = ({
  metadata,
  moveBalanceChanges,
}: MoveBalanceChangesComponentProps) => {
  const isMobile = useMobile();
  const templateColumns = "230px 1fr";

  const addresses = useMemo(
    () =>
      Array.from(
        new Set([
          ...Object.keys(moveBalanceChanges.ft),
          ...Object.keys(moveBalanceChanges.object),
        ])
      ),
    [moveBalanceChanges.ft, moveBalanceChanges.object]
  );

  const mapped = useMemo(
    () =>
      addresses
        .map((address) => {
          const ftChange = moveBalanceChanges.ft[address];
          const ftChangeEntries = Object.entries(ftChange ?? {}).filter(
            ([, amount]) => amount !== "0"
          );

          const objectChange = moveBalanceChanges.object[address];
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
    [addresses, moveBalanceChanges.ft, moveBalanceChanges.object]
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

interface BalanceChangesProps {
  metadata?: Metadata;
  totalBalanceChanges: TotalBalanceChanges;
}

export const BalanceChanges = ({
  metadata,
  totalBalanceChanges,
}: BalanceChangesProps) => {
  // TODO
  if (totalBalanceChanges.vm === "evm") return null;

  return (
    <MoveBalanceChangesComponent
      metadata={metadata}
      moveBalanceChanges={totalBalanceChanges}
    />
  );
};
