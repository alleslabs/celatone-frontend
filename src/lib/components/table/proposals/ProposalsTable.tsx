import { TableContainer } from "../tableComponents";
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
    "100px minmax(360px, 2fr) minmax(150px, 1fr) 330px 180px 160px";
  const boxShadow = "16px 0 32px -10px";

  return (
    <TableContainer>
      <ProposalsTableHeader
        templateColumns={templateColumns}
        boxShadow={boxShadow}
      />
      {proposals.map((proposal) => (
        <ProposalsTableRow
          key={proposal.proposalId}
          proposal={proposal}
          templateColumns={templateColumns}
          boxShadow={boxShadow}
        />
      ))}
    </TableContainer>
  );
};
