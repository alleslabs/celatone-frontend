import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { TableContainer } from "lib/components/table";
import type { Option, Proposal } from "lib/types";

import { ProposalTableHeader } from "./ProposalTableHeader";
import { ProposalTableRow } from "./ProposalTableRow";

interface PorposalTableProps {
  proposals: Option<Proposal[]>;
  isLoading: boolean;
}

const TEMPLATE_COLUMNS =
  "100px minmax(360px, 2fr) minmax(150px, 1fr) 330px 180px 160px";
const BOX_SHADOW = "16px 0 32px -7px #272734";

export const PorposalTable = ({ proposals, isLoading }: PorposalTableProps) => {
  if (isLoading) return <Loading />;
  if (!proposals?.length)
    return (
      <EmptyState
        message="There are no proposals in this network."
        imageVariant="empty"
        withBorder
      />
    );

  return (
    <TableContainer>
      <ProposalTableHeader
        boxShadow={BOX_SHADOW}
        templateColumns={TEMPLATE_COLUMNS}
      />
      {proposals.map((proposal) => (
        <ProposalTableRow
          key={proposal.proposalId}
          proposal={proposal}
          templateColumns={TEMPLATE_COLUMNS}
          boxShadow={BOX_SHADOW}
        />
      ))}
    </TableContainer>
  );
};
