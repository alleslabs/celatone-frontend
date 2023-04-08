import type { GridProps } from "@chakra-ui/react";
import { Grid, Text } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Proposer } from "lib/components/table/proposals/Proposer";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";

import { ResolvedHeight } from "./ResolvedHeight";
import { StatusChip } from "./StatusChip";
import { VotingEndTime } from "./VotingEndTime";

export interface ProposalsTableRowProps {
  proposal: Proposal;
  templateColumns: GridProps["templateColumns"];
}

export const ProposalsTableRow = ({
  proposal,
  templateColumns,
}: ProposalsTableRowProps) => {
  const isDepositFailed = proposal.status === ProposalStatus.DEPOSIT_FAILED;
  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;
  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <ExplorerLink
          isReadOnly={isDepositFailed}
          type="proposal_id"
          value={proposal.proposalId.toString()}
          showCopyOnHover
        />
      </TableRow>
      <TableRow>{proposal.title}</TableRow>
      <TableRow justifyContent="center">
        <StatusChip status={proposal.status} />
      </TableRow>
      <TableRow>
        <VotingEndTime
          votingEndTime={proposal.votingEndTime}
          depositEndTime={proposal.depositEndTime}
          status={proposal.status}
        />
      </TableRow>
      <TableRow>
        <ResolvedHeight
          resolvedHeight={proposal.resolvedHeight}
          isDepositOrVoting={isDepositOrVoting}
          isDepositFailed={isDepositFailed}
        />
      </TableRow>
      <TableRow>
        <Text color="text.dark">{proposal.type}</Text>
      </TableRow>
      <TableRow>
        <Proposer proposer={proposal.proposer} />
      </TableRow>
    </Grid>
  );
};
