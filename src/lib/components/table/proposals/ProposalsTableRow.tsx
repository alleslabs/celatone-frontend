import type { DividerProps, GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableRow, TableRowFreeze } from "../tableComponents";
import { useInternalNavigate, useTierConfig } from "lib/app-provider";
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
  boxShadow: DividerProps["boxShadow"];
  proposal: Proposal;
  templateColumns: GridProps["templateColumns"];
}

export const ProposalsTableRow = ({
  boxShadow,
  proposal,
  templateColumns,
}: ProposalsTableRowProps) => {
  const { isFullTier } = useTierConfig();
  const navigate = useInternalNavigate();

  const onRowSelect = (proposalId: number) =>
    navigate({
      pathname: "/proposals/[proposalId]",
      query: { proposalId },
    });

  // TODO - Revisit split columnsWidth
  const columnsWidth = templateColumns?.toString().split(" ");
  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;
  return (
    <Grid
      className="copier-wrapper"
      minW="min-content"
      _hover={{
        "> div": {
          bgColor:
            proposal.isExpedited && isDepositOrVoting
              ? "primary.background"
              : "gray.900",
        },
      }}
      cursor="pointer"
      onClick={() => onRowSelect(proposal.id)}
      templateColumns={templateColumns}
    >
      <TableRowFreeze left="0">
        <ExplorerLink
          type="proposal_id"
          value={proposal.id.toString()}
          ampCopierSection="proposal-list"
          showCopyOnHover
        />
      </TableRowFreeze>
      <TableRowFreeze
        left={columnsWidth && columnsWidth[0]}
        boxShadow={boxShadow}
        color="gray.800"
      >
        <ProposalTextCell
          isExpedited={proposal.isExpedited}
          title={proposal.title}
          types={proposal.types}
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
          status={proposal.status}
          depositEndTime={proposal.depositEndTime}
          votingEndTime={proposal.votingEndTime}
        />
      </TableRow>
      {isFullTier && (
        <TableRow>
          <StopPropagationBox>
            <ResolvedHeight
              amptrackSection="proposal-list"
              isDepositOrVoting={isDepositOrVoting}
              resolvedHeight={proposal.resolvedHeight}
            />
          </StopPropagationBox>
        </TableRow>
      )}
      <TableRow>
        <Proposer
          amptrackSection="proposal-list"
          proposer={proposal.proposer}
        />
      </TableRow>
    </Grid>
  );
};
