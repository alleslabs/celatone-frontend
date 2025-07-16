import type { Metadata } from "@initia/tx-decoder";

import { Divider, Grid, Stack } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";

import { BalanceChangeNft } from "./balance-changes-nft";
import { BalanceChangesToken } from "./balance-changes-token";

interface BalanceChangesTableRowProps {
  address: string;
  ftChangeEntries: [string, string][];
  metadata?: Metadata;
  objectChangeEntries: [string, string][];
  templateColumns: string;
}

export const BalanceChangesTableRow = ({
  address,
  ftChangeEntries,
  metadata,
  objectChangeEntries,
  templateColumns,
}: BalanceChangesTableRowProps) => {
  const getAddressType = useGetAddressType();

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
          {ftChangeEntries.map(([denom, amount], index) => (
            <Stack key={`${address}-${denom}`} gap={3}>
              {amount === "0" ? (
                <Text color="text.dark" variant="body2">
                  No balance changes
                </Text>
              ) : (
                <BalanceChangesToken coin={new Coin(denom, amount)} />
              )}
              {index < ftChangeEntries.length - 1 && (
                <Divider borderColor="gray.700" />
              )}
            </Stack>
          ))}
          {ftChangeEntries.length > 0 && objectChangeEntries.length > 0 && (
            <Divider borderColor="gray.700" />
          )}
          {metadata &&
            objectChangeEntries.map(([id, change], index) => (
              <Stack key={`${address}-${id}`} gap={3}>
                <BalanceChangeNft
                  id={id}
                  change={Number(change)}
                  metadata={metadata}
                />
                {index < objectChangeEntries.length - 1 && (
                  <Divider borderColor="gray.700" />
                )}
              </Stack>
            ))}
        </Stack>
      </TableRow>
    </Grid>
  );
};
