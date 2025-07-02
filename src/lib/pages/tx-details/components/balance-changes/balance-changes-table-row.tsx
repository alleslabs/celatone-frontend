import type { FtChange } from "@initia/tx-decoder";

import { Divider, Grid, Stack } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";

import { BalanceChangesToken } from "./balance-changes-token";

interface BalanceChangesTableRowProps {
  address: string;
  changes: FtChange;
  templateColumns: string;
}

export const BalanceChangesTableRow = ({
  address,
  changes,
  templateColumns,
}: BalanceChangesTableRowProps) => {
  const getAddressType = useGetAddressType();
  const changeEntries = Object.entries(changes);
  return (
    <Grid bg="gray.900" rounded={8} templateColumns={templateColumns}>
      <TableRow borderBottom={0} minH={0} p={4}>
        <ExplorerLink
          showCopyOnHover
          textVariant="body2"
          type={getAddressType(address)}
          value={address}
        />
      </TableRow>
      <TableRow borderBottom={0} minH={0} p={4}>
        <Stack w="full">
          {changeEntries.map(([denom, amount], index) => (
            <Stack key={`${address}-${denom}`} gap={3}>
              <BalanceChangesToken coin={new Coin(denom, amount)} />
              {changeEntries.length - 1 !== index && (
                <Divider borderColor="gray.700" />
              )}
            </Stack>
          ))}
        </Stack>
      </TableRow>
    </Grid>
  );
};
