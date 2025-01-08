import { Box, Grid, Text } from "@chakra-ui/react";
import type { DividerProps, GridProps } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { StopPropagationBox } from "lib/components/StopPropagationBox";
import {
  Answer,
  StatusChip,
  TableRow,
  TableRowFreeze,
} from "lib/components/table";
import { ProposalTextCell } from "lib/components/table/proposals/ProposalTextCell";
import type { ValidatorVotedProposalsResponseItem } from "lib/services/types";
import { ProposalStatus } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

export interface VotedProposalsTableRowProps {
  boxShadow: DividerProps["boxShadow"];
  templateColumns: GridProps["templateColumns"];
  votedProposal: ValidatorVotedProposalsResponseItem;
}

export const VotedProposalsTableRow = ({
  boxShadow,
  templateColumns,
  votedProposal,
}: VotedProposalsTableRowProps) => {
  const navigate = useInternalNavigate();

  const onRowSelect = (proposalId: number) =>
    navigate({
      pathname: "/proposals/[proposalId]",
      query: { proposalId },
    });

  const isDepositOrVoting =
    votedProposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    votedProposal.status === ProposalStatus.VOTING_PERIOD;

  return (
    <Grid
      className="copier-wrapper"
      minW="min-content"
      _hover={{
        "> div": {
          bgColor:
            votedProposal.isExpedited && isDepositOrVoting
              ? "primary.background"
              : "gray.900",
        },
      }}
      cursor="pointer"
      onClick={() => onRowSelect(votedProposal.proposalId)}
      templateColumns={templateColumns}
    >
      <TableRowFreeze left="0">
        <ExplorerLink
          type="proposal_id"
          value={votedProposal.proposalId.toString()}
          ampCopierSection="proposal-list"
          showCopyOnHover
        />
      </TableRowFreeze>
      <TableRowFreeze
        left={templateColumns?.toString().split(" ")[0]}
        boxShadow={boxShadow}
        color="gray.800"
      >
        <ProposalTextCell
          isExpedited={votedProposal.isExpedited}
          title={votedProposal.title}
          types={votedProposal.types}
          isDepositOrVoting={isDepositOrVoting}
        />
      </TableRowFreeze>
      <TableRow justifyContent="center">
        <StopPropagationBox>
          <StatusChip status={votedProposal.status} />
        </StopPropagationBox>
      </TableRow>
      <TableRow>
        <Answer
          abstain={votedProposal.abstain}
          yes={votedProposal.yes}
          isVoteWeighted={votedProposal.isVoteWeighted}
          no={votedProposal.no}
          noWithVeto={votedProposal.noWithVeto}
        />
      </TableRow>
      <TableRow>
        {votedProposal.timestamp ? (
          <Box>
            <Text variant="body2" color="text.dark">
              {formatUTC(votedProposal.timestamp)}
            </Text>
            <Text variant="body3" color="text.disabled">
              {`(${dateFromNow(votedProposal.timestamp)})`}
            </Text>
          </Box>
        ) : (
          <Text variant="body2" color="text.dark">
            -
          </Text>
        )}
      </TableRow>
    </Grid>
  );
};
