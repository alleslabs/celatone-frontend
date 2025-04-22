import type { DividerProps, GridProps } from "@chakra-ui/react";
import type { Proposal } from "lib/types";

import { Grid } from "@chakra-ui/react";
import { useInternalNavigate, useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { StopPropagationBox } from "lib/components/StopPropagationBox";
import { ProposalStatus } from "lib/types";

import { TableRow, TableRowFreeze } from "../tableComponents";
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
      _hover={{
        "> div": {
          bgColor:
            proposal.isExpedited && isDepositOrVoting
              ? "primary.background"
              : "gray.900",
        },
      }}
      cursor="pointer"
      minW="min-content"
      templateColumns={templateColumns}
      onClick={() => onRowSelect(proposal.id)}
    >
      <TableRowFreeze left="0">
        <ExplorerLink
          ampCopierSection="proposal-list"
          showCopyOnHover
          type="proposal_id"
          value={proposal.id.toString()}
        />
      </TableRowFreeze>
      <TableRowFreeze
        boxShadow={boxShadow}
        color="gray.800"
        left={columnsWidth && columnsWidth[0]}
      >
        <ProposalTextCell
          isDepositOrVoting={isDepositOrVoting}
          isExpedited={proposal.isExpedited}
          title={proposal.title}
          types={proposal.types}
        />
      </TableRowFreeze>
      <TableRow justifyContent="center">
        <StopPropagationBox>
          <StatusChip status={proposal.status} />
        </StopPropagationBox>
      </TableRow>
      <TableRow>
        <VotingEndTime
          depositEndTime={proposal.depositEndTime}
          status={proposal.status}
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
