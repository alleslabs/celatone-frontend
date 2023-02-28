import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { StatusChip } from "./StatusChip";

interface ProposalsTableRowProps {
  proposal: Proposal;
  templateColumns: GridProps["templateColumns"];
}

const VotingEndTimeRender = ({
  votingEndTime,
  depositEndTime,
  status,
}: {
  votingEndTime: Proposal["votingEndTime"];
  depositEndTime: Proposal["depositEndTime"];
  status: Proposal["status"];
}) => {
  if (status === ProposalStatus.INACTIVE) {
    return <Text color="text.dark">N/A</Text>;
  }

  const isDepositPeriod = status === ProposalStatus.DEPOSIT_PERIOD;
  return (
    <Flex
      direction="column"
      sx={{
        "& > p:first-of-type": {
          color: isDepositPeriod ? "text.dark" : "text.main",
          mb: "2px",
        },
        "& > p:last-of-type": {
          color: "text.dark",
          fontSize: "12px",
        },
      }}
    >
      <p>{isDepositPeriod ? "Voting not started" : formatUTC(votingEndTime)}</p>
      <p>
        (
        {isDepositPeriod
          ? `Deposit Period ends ${dateFromNow(depositEndTime)}`
          : dateFromNow(votingEndTime)}
        )
      </p>
    </Flex>
  );
};

const ResolvedHeightRender = ({
  resolvedHeight,
  isInactive,
}: {
  resolvedHeight: ProposalsTableRowProps["proposal"]["resolvedHeight"];
  isInactive: boolean;
}) => {
  if (isInactive) return <Text color="text.dark">N/A</Text>;

  switch (resolvedHeight) {
    case undefined:
      return <Text color="text.dark">N/A</Text>;
    case null:
      return <Text color="text.dark">Pending</Text>;
    default:
      return (
        <ExplorerLink
          type="block_height"
          value={resolvedHeight.toString()}
          canCopyWithHover
        />
      );
  }
};

export const ProposalsTableRow = ({
  proposal,
  templateColumns,
}: ProposalsTableRowProps) => {
  const getAddressType = useGetAddressType();
  const isInactive = proposal.status === ProposalStatus.INACTIVE;
  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <ExplorerLink
          isReadOnly={isInactive}
          type="proposal_id"
          value={proposal.proposalId.toString()}
          canCopyWithHover
        />
      </TableRow>
      <TableRow>{proposal.title}</TableRow>
      <TableRow justifyContent="center">
        <StatusChip status={proposal.status} />
      </TableRow>
      <TableRow>
        <VotingEndTimeRender
          votingEndTime={proposal.votingEndTime}
          depositEndTime={proposal.depositEndTime}
          status={proposal.status}
        />
      </TableRow>
      <TableRow>
        <ResolvedHeightRender
          resolvedHeight={proposal.resolvedHeight}
          isInactive={isInactive}
        />
      </TableRow>
      <TableRow>
        <Text color="text.dark">{proposal.type}</Text>
      </TableRow>
      <TableRow>
        {proposal.proposer ? (
          <ExplorerLink
            type={getAddressType(proposal.proposer)}
            value={proposal.proposer}
            canCopyWithHover
          />
        ) : (
          "N/A"
        )}
      </TableRow>
    </Grid>
  );
};
