import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { Option, Proposal } from "lib/types";

import { ProposalsTableHeader } from "./ProposalsTableHeader";
import { ProposalsTableRow } from "./ProposalsTableRow";

interface ProposalsTableProps {
  proposals: Option<Proposal[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const ProposalsTable = ({
  proposals,
  isLoading,
  emptyState,
}: ProposalsTableProps) => {
  if (isLoading) return <Loading />;
  if (!proposals?.length) return emptyState;

  const templateColumns =
    "100px minmax(300px, 1fr) 150px 280px 180px 190px 160px";

  return (
    <TableContainer>
      <ProposalsTableHeader templateColumns={templateColumns} />
      {proposals.map((proposal) => (
        <ProposalsTableRow
          key={proposal.proposalId}
          proposal={proposal}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
