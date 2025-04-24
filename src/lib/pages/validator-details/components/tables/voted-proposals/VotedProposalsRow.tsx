import type { DividerProps, GridProps } from "@chakra-ui/react";
import type { ValidatorVotedProposalsResponseItem } from "lib/services/types";

import { Box, Grid, Text } from "@chakra-ui/react";
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
      _hover={{
        "> div": {
          bgColor:
            votedProposal.isExpedited && isDepositOrVoting
              ? "primary.background"
              : "gray.900",
        },
      }}
      cursor="pointer"
      minW="min-content"
      templateColumns={templateColumns}
      onClick={() => onRowSelect(votedProposal.proposalId)}
    >
      <TableRowFreeze left="0">
        <ExplorerLink
          ampCopierSection="proposal-list"
          showCopyOnHover
          type="proposal_id"
          value={votedProposal.proposalId.toString()}
        />
      </TableRowFreeze>
      <TableRowFreeze
        boxShadow={boxShadow}
        color="gray.800"
        left={templateColumns?.toString().split(" ")[0]}
      >
        <ProposalTextCell
          isDepositOrVoting={isDepositOrVoting}
          isEmergency={votedProposal.isEmergency}
          isExpedited={votedProposal.isExpedited}
          title={votedProposal.title}
          types={votedProposal.types}
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
          isVoteWeighted={votedProposal.isVoteWeighted}
          no={votedProposal.no}
          noWithVeto={votedProposal.noWithVeto}
          yes={votedProposal.yes}
        />
      </TableRow>
      <TableRow>
        {votedProposal.timestamp ? (
          <Box>
            <Text color="text.dark" variant="body2">
              {formatUTC(votedProposal.timestamp)}
            </Text>
            <Text color="text.disabled" variant="body3">
              {`(${dateFromNow(votedProposal.timestamp)})`}
            </Text>
          </Box>
        ) : (
          <Text color="text.dark" variant="body2">
            -
          </Text>
        )}
      </TableRow>
    </Grid>
  );
};
