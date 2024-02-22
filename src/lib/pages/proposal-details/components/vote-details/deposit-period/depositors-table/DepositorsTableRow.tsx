import { Flex, Grid, Text } from "@chakra-ui/react";

import { DepositAmounts } from "../../../DepositAmounts";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { ProposalDeposit } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface DepositorsTableRowProps {
  proposalDeposit: ProposalDeposit;
  templateColumns: string;
}

export const DepositorsTableRow = ({
  proposalDeposit,
  templateColumns,
}: DepositorsTableRowProps) => {
  const isMobile = useMobile();

  return (
    <Grid templateColumns={templateColumns} minW="min-content">
      <TableRow pl={isMobile ? 0 : 4}>
        <ExplorerLink
          type="user_address"
          value={proposalDeposit.depositor}
          showCopyOnHover={!isMobile}
        />
      </TableRow>
      {!isMobile && (
        <>
          <TableRow>
            {proposalDeposit.txHash ? (
              <ExplorerLink
                type="tx_hash"
                value={proposalDeposit.txHash.toUpperCase()}
              />
            ) : (
              <Text variant="body2">N/A</Text>
            )}
          </TableRow>
          <TableRow>
            {proposalDeposit.timestamp ? (
              <Flex direction="column">
                <Text variant="body3">
                  {formatUTC(proposalDeposit.timestamp)}
                </Text>
                <Text variant="body3" color="text.dark" mt="2px">
                  ({dateFromNow(proposalDeposit.timestamp)})
                </Text>
              </Flex>
            ) : (
              <Text variant="body3" color="text.dark">
                N/A
              </Text>
            )}
          </TableRow>
        </>
      )}
      <TableRow justifyContent="flex-end" pr={isMobile ? 0 : 4}>
        <DepositAmounts deposit={proposalDeposit} />
      </TableRow>
    </Grid>
  );
};
