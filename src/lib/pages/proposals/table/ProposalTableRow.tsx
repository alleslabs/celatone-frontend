import type { GridProps } from "@chakra-ui/react";
import { Flex, Box, Grid, Text } from "@chakra-ui/react";

import { useGetAddressType } from "lib/app-provider";
import { DotSeparator } from "lib/components/DotSeperator";
import { Expedited } from "lib/components/Expedited";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow, TableRowFreeze } from "lib/components/table";
import { ResolvedHeight } from "lib/components/table/proposals/ResolvedHeight";
import { StatusChip } from "lib/components/table/proposals/StatusChip";
import { VotingEndTime } from "lib/components/table/proposals/VotingEndTime";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";

interface ProposalRowProps {
  templateColumns: GridProps["templateColumns"];
  proposal: Proposal;
}

export const ProposalTableRow = ({
  templateColumns,
  proposal,
}: ProposalRowProps) => {
  const getAddressType = useGetAddressType();
  const columnsWidth = templateColumns?.toString().split(" ");
  const isInactive = proposal.status === ProposalStatus.INACTIVE;
  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;

  return (
    <Grid templateColumns={templateColumns} minW="min-content">
      <TableRowFreeze left="0">
        <ExplorerLink
          isReadOnly={isInactive}
          type="proposal_id"
          value={proposal.proposalId.toString()}
          showCopyOnHover
        />
      </TableRowFreeze>
      <TableRowFreeze left={columnsWidth && columnsWidth[0]}>
        <Box>
          <Text variant="body2">{proposal.title}</Text>
          <Flex gap={1} align="center">
            {proposal.isExpedited && (
              <>
                <Expedited isActiveExpedited={isDepositOrVoting} />
                <DotSeparator />
              </>
            )}
            <Text variant="body3" color="text.dark">
              {proposal.type}
            </Text>
          </Flex>
        </Box>
      </TableRowFreeze>
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
          isInactive={isInactive}
          isDepositOrVoting={isDepositOrVoting}
        />
      </TableRow>
      <TableRow>
        {proposal.proposer ? (
          <ExplorerLink
            type={getAddressType(proposal.proposer)}
            value={proposal.proposer}
            showCopyOnHover
          />
        ) : (
          "N/A"
        )}
      </TableRow>
    </Grid>
  );
};
