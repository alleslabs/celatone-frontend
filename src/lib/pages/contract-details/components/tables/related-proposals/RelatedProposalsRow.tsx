import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { useGetAddressType } from "lib/hooks";
import type { ContractRelatedProposals } from "lib/types";
import { ProposalStatus } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { StatusChip } from "./StatusChip";

interface RelatedProposalsRowProps {
  proposal: ContractRelatedProposals;
  templateColumns: GridProps["templateColumns"];
}

const VotingEndTimeRender = ({
  votingEndTime,
  depositEndTime,
  status,
}: {
  votingEndTime: ContractRelatedProposals["votingEndTime"];
  depositEndTime: ContractRelatedProposals["depositEndTime"];
  status: ContractRelatedProposals["status"];
}) => {
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
          ? `Deposit Period ends in ${dateFromNow(depositEndTime)}`
          : dateFromNow(votingEndTime)}
        )
      </p>
    </Flex>
  );
};

export const RelatedProposalsRow = ({
  proposal,
  templateColumns,
}: RelatedProposalsRowProps) => {
  const getAddressType = useGetAddressType();
  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <ExplorerLink
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
        {proposal.resolvedHeight ? (
          <ExplorerLink
            type="block_height"
            value={proposal.resolvedHeight.toString()}
            canCopyWithHover
          />
        ) : (
          <Text color="text.dark">Pending</Text>
        )}
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
