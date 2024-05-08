import { TableContainer } from "@chakra-ui/react";

import { EmptyState } from "lib/components/state";
import type { ProposalDeposit } from "lib/types";

import { DepositorsTableHeader } from "./DepositorsTableHeader";
import { DepositorsTableRow } from "./DepositorsTableRow";

interface DepositorsTableProps {
  depositors: ProposalDeposit[];
}

const templateColumns = `1.5fr 1.5fr 2fr 1fr`;

export const DepositorsTable = ({ depositors }: DepositorsTableProps) => {
  if (depositors.length === 0)
    return <EmptyState message="The proposal has no depositors yet." />;

  return (
    <TableContainer>
      <DepositorsTableHeader templateColumns={templateColumns} />
      {depositors.map((each) => (
        <DepositorsTableRow
          key={each.depositor}
          proposalDeposit={each}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
