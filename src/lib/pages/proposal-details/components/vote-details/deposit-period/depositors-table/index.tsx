import type { ProposalDeposit } from "lib/types";

import { TableContainer } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";

import { DepositorsTableHeader } from "./DepositorsTableHeader";
import { DepositorsTableRow } from "./DepositorsTableRow";

interface DepositorsTableProps {
  depositors: ProposalDeposit[];
  isDepositsLoading: boolean;
  showTransaction: boolean;
  isPruned: boolean;
}

export const DepositorsTable = ({
  depositors,
  isDepositsLoading,
  showTransaction,
  isPruned,
}: DepositorsTableProps) => {
  const templateColumns = showTransaction ? "1.5fr 1.5fr 2fr 1fr" : "240px 1fr";

  if (isDepositsLoading) return <Loading />;

  if (isPruned)
    return (
      <EmptyState message="The proposal has ended, and the depositor list is already pruned from the REST." />
    );

  if (depositors.length === 0)
    return <EmptyState message="The proposal has no depositors yet." />;

  return (
    <TableContainer>
      <DepositorsTableHeader
        showTransaction={showTransaction}
        templateColumns={templateColumns}
      />
      {depositors.map((each) => (
        <DepositorsTableRow
          key={each.depositor}
          proposalDeposit={each}
          showTransaction={showTransaction}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
