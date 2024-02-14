import type { DividerProps, GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableRow, TableRowFreeze } from "../tableComponents";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { StopPropagationBox } from "lib/components/StopPropagationBox";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";

import { ProposalTextCell } from "./ProposalTextCell";
import { Proposer } from "./Proposer";
import { ResolvedHeight } from "./ResolvedHeight";
import { StatusChip } from "./StatusChip";
import { VotingEndTime } from "./VotingEndTime";

export interface ProposalsTableRowProps {
  proposal: Proposal;
  templateColumns: GridProps["templateColumns"];
  boxShadow: DividerProps["boxShadow"];
}

export const ProposalsTableRow = ({
  proposal,
  templateColumns,
  boxShadow,
}: ProposalsTableRowProps) => {
  // TODO - Revisit split columnsWidth
  const columnsWidth = templateColumns?.toString().split(" ");
  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;
  return (
    <AppLink href={`/proposals/${proposal.id}`}>
      <Grid
        templateColumns={templateColumns}
        minW="min-content"
        cursor="pointer"
        _hover={{
          "> div": {
            bgColor:
              proposal.isExpedited && isDepositOrVoting
                ? "primary.background"
                : "gray.900",
          },
        }}
      >
        <TableRowFreeze left="0">
          <ExplorerLink
            type="proposal_id"
            value={proposal.id.toString()}
            showCopyOnHover
            ampCopierSection="proposal-list"
          />
        </TableRowFreeze>
        <TableRowFreeze
          left={columnsWidth && columnsWidth[0]}
          boxShadow={boxShadow}
          color="gray.800"
        >
          <ProposalTextCell
            title={proposal.title}
            types={proposal.types}
            isExpedited={proposal.isExpedited}
            isDepositOrVoting={isDepositOrVoting}
          />
        </TableRowFreeze>
        <TableRow justifyContent="center">
          <StopPropagationBox>
            <StatusChip status={proposal.status} />
          </StopPropagationBox>
        </TableRow>
        <TableRow>
          <VotingEndTime
            votingEndTime={proposal.votingEndTime}
            depositEndTime={proposal.depositEndTime}
            status={proposal.status}
          />
        </TableRow>
        <TableRow>
          <StopPropagationBox>
            <ResolvedHeight
              resolvedHeight={proposal.resolvedHeight}
              isDepositOrVoting={isDepositOrVoting}
              amptrackSection="proposal-list"
            />
          </StopPropagationBox>
        </TableRow>
        <TableRow>
          <Proposer
            proposer={proposal.proposer}
            amptrackSection="proposal-list"
          />
        </TableRow>
      </Grid>
    </AppLink>
  );
};
