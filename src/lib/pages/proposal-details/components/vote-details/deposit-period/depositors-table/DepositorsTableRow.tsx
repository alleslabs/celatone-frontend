import type { ProposalDeposit } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";

import { DepositAmounts } from "../../../DepositAmounts";

interface DepositorsTableRowProps {
  proposalDeposit: ProposalDeposit;
  templateColumns: string;
  showTransaction: boolean;
}

export const DepositorsTableRow = ({
  proposalDeposit,
  templateColumns,
  showTransaction,
}: DepositorsTableRowProps) => (
  <Grid
    className="copier-wrapper"
    minW="min-content"
    templateColumns={templateColumns}
  >
    <TableRow>
      <ExplorerLink
        showCopyOnHover
        type="user_address"
        value={proposalDeposit.depositor}
      />
    </TableRow>
    {showTransaction && (
      <>
        <TableRow>
          {proposalDeposit.txHash ? (
            <ExplorerLink
              showCopyOnHover
              type="tx_hash"
              value={proposalDeposit.txHash.toUpperCase()}
            />
          ) : (
            <Text textColor="text.dark" variant="body3">
              N/A
            </Text>
          )}
        </TableRow>
        <TableRow>
          {proposalDeposit.timestamp ? (
            <Flex direction="column">
              <Text variant="body3">
                {formatUTC(proposalDeposit.timestamp)}
              </Text>
              <Text color="text.dark" mt="2px" variant="body3">
                ({dateFromNow(proposalDeposit.timestamp)})
              </Text>
            </Flex>
          ) : (
            <Text color="text.dark" variant="body3">
              N/A
            </Text>
          )}
        </TableRow>
      </>
    )}
    <TableRow>
      <DepositAmounts deposit={proposalDeposit} />
    </TableRow>
  </Grid>
);
