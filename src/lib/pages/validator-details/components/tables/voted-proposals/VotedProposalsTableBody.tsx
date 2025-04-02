import type { ValidatorVotedProposalsResponse } from "lib/services/types";
import type { Option } from "lib/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";

import { VotedProposalsTableRow } from "./VotedProposalsRow";
import { VotedProposalsTableHeader } from "./VotedProposalsTableHeader";
import { VotedProposalsTableMobileCard } from "./VotedProposalsTableMobileCard";

const templateColumns =
  "100px minmax(360px, 2fr) 150px 150px minmax(330px, 1fr)";
const boxShadow = "16px 0 32px -10px";

interface VotedProposalsTableBodyProps {
  data: Option<ValidatorVotedProposalsResponse>;
  isLoading: boolean;
  onViewMore?: () => void;
  search: string;
}

export const VotedProposalsTableBody = ({
  data,
  isLoading,
  onViewMore,
  search,
}: VotedProposalsTableBodyProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="voted proposals" />;
  if (!data.total)
    return !search.trim().length ? (
      <EmptyState
        imageVariant={onViewMore ? undefined : "empty"}
        message="This validator had no eligibility to cast votes on any proposals."
        withBorder
      />
    ) : (
      <EmptyState
        imageVariant="not-found"
        message="No proposals match your input. Please ensure it is a valid proposal ID or title."
        withBorder
      />
    );

  return isMobile ? (
    <MobileTableContainer>
      {data.items.map((votedProposal) => (
        <VotedProposalsTableMobileCard
          key={votedProposal.proposalId}
          votedProposal={votedProposal}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <VotedProposalsTableHeader
        boxShadow={boxShadow}
        templateColumns={templateColumns}
      />
      {data.items.map((votedProposal) => (
        <VotedProposalsTableRow
          key={votedProposal.proposalId}
          boxShadow={boxShadow}
          templateColumns={templateColumns}
          votedProposal={votedProposal}
        />
      ))}
    </TableContainer>
  );
};
