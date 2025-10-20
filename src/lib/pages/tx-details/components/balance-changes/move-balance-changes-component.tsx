import type { Metadata, MoveBalanceChanges } from "@initia/tx-decoder";

import { Stack, TableContainer } from "@chakra-ui/react";
import { useGetAddressType, useMobile } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";
import { useMemo } from "react";

import { BalanceChangesMobileCard } from "./balance-changes-mobile-card";
import { BalanceChangesTableHeader } from "./balance-changes-table-header";
import { BalanceChangesTableRow } from "./balance-changes-table-row";
import {
  filterNonZeroFtChanges,
  filterNonZeroObjectChanges,
  getMoveAddresses,
} from "./utils";

interface MoveBalanceChangesComponentProps {
  metadata?: Metadata;
  moveBalanceChanges: MoveBalanceChanges;
}

export const MoveBalanceChangesComponent = ({
  metadata,
  moveBalanceChanges,
}: MoveBalanceChangesComponentProps) => {
  const isMobile = useMobile();
  const getAddressType = useGetAddressType();
  const templateColumns = "230px 1fr";

  const addresses = useMemo(
    () => getMoveAddresses(moveBalanceChanges),
    [moveBalanceChanges]
  );

  const mapped = useMemo(
    () =>
      addresses
        .map((address) => {
          const ftChange = moveBalanceChanges.ft[address];
          const ftChangeEntries = filterNonZeroFtChanges(ftChange);

          const objectChange = moveBalanceChanges.object[address];
          const objectChangeEntries = filterNonZeroObjectChanges(objectChange);

          if (ftChangeEntries.length + objectChangeEntries.length === 0)
            return null;

          return {
            address,
            addressType: getAddressType(address),
            ftChangeEntries,
            objectChangeEntries,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [
      addresses,
      getAddressType,
      moveBalanceChanges.ft,
      moveBalanceChanges.object,
    ]
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
        {mapped.map(
          ({ address, addressType, ftChangeEntries, objectChangeEntries }) => (
            <BalanceChangesMobileCard
              key={address}
              address={address}
              addressType={addressType}
              ftChangeEntries={ftChangeEntries}
              metadata={metadata}
              objectChangeEntries={objectChangeEntries}
            />
          )
        )}
      </MobileTableContainer>
    );
  }

  return (
    <TableContainer>
      <BalanceChangesTableHeader templateColumns={templateColumns} />
      <Stack>
        {mapped.map(
          ({ address, addressType, ftChangeEntries, objectChangeEntries }) => (
            <BalanceChangesTableRow
              key={address}
              address={address}
              addressType={addressType}
              ftChangeEntries={ftChangeEntries}
              metadata={metadata}
              objectChangeEntries={objectChangeEntries}
              templateColumns={templateColumns}
            />
          )
        )}
      </Stack>
    </TableContainer>
  );
};
