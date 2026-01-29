import type { EvmBalanceChanges, Metadata } from "@initia/tx-decoder";

import { Stack, TableContainer } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";
import { useMemo } from "react";

import { BalanceChangesMobileCard } from "./balance-changes-mobile-card";
import { BalanceChangesTableHeader } from "./balance-changes-table-header";
import { BalanceChangesTableRow } from "./balance-changes-table-row";
import {
  calculateTotalNftChanges,
  filterNonZeroFtChanges,
  getEvmAddresses,
  getEvmAddressType,
  processEvmNftChanges,
} from "./utils";

interface EvmBalanceChangesComponentProps {
  evmBalanceChanges: EvmBalanceChanges;
  metadata?: Metadata;
}

export const EvmBalanceChangesComponent = ({
  evmBalanceChanges,
  metadata,
}: EvmBalanceChangesComponentProps) => {
  const isMobile = useMobile();
  const templateColumns = "230px 1fr";

  const addresses = useMemo(
    () => getEvmAddresses(evmBalanceChanges),
    [evmBalanceChanges]
  );

  const mapped = useMemo(
    () =>
      addresses
        .map((address) => {
          const ftChange = evmBalanceChanges.ft[address];
          const ftChangeEntries = filterNonZeroFtChanges(ftChange);

          const nftChange = evmBalanceChanges.nft[address];
          const nftChangeEntries = processEvmNftChanges(nftChange);

          const totalNftChanges = calculateTotalNftChanges(nftChangeEntries);

          if (ftChangeEntries.length + totalNftChanges === 0) return null;

          return {
            address,
            addressType: getEvmAddressType(),
            ftChangeEntries,
            nftChangeEntries,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [addresses, evmBalanceChanges.ft, evmBalanceChanges.nft]
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
          ({ address, addressType, ftChangeEntries, nftChangeEntries }) => (
            <BalanceChangesMobileCard
              key={address}
              address={address}
              addressType={addressType}
              ftChangeEntries={ftChangeEntries}
              metadata={metadata}
              nftChangeEntries={nftChangeEntries}
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
          ({ address, addressType, ftChangeEntries, nftChangeEntries }) => (
            <BalanceChangesTableRow
              key={address}
              address={address}
              addressType={addressType}
              ftChangeEntries={ftChangeEntries}
              metadata={metadata}
              nftChangeEntries={nftChangeEntries}
              templateColumns={templateColumns}
            />
          )
        )}
      </Stack>
    </TableContainer>
  );
};
