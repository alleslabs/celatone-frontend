import type { DividerProps, GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { ProposalTextCell } from "../components/ProposalTextCell";
import { getProposalUrl } from "lib/app-fns/explorer";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow, TableRowFreeze } from "lib/components/table";
import { ResolvedHeight } from "lib/components/table/proposals/ResolvedHeight";
import { StatusChip } from "lib/components/table/proposals/StatusChip";
import { VotingEndTime } from "lib/components/table/proposals/VotingEndTime";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";

interface ProposalRowProps {
  proposal: Proposal;
  templateColumns: GridProps["templateColumns"];
  boxShadow: DividerProps["boxShadow"];
}

export const ProposalTableRow = ({
  proposal,
  templateColumns,
  boxShadow,
}: ProposalRowProps) => {
  const { currentChainName } = useWallet();

  const getAddressType = useGetAddressType();
  const columnsWidth = templateColumns?.toString().split(" ");
  const isInactive = proposal.status === ProposalStatus.INACTIVE;
  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;

  const hoverBg = () => {
    if (proposal.isExpedited && isDepositOrVoting) return "violet.background";
    if (!isInactive) return "pebble.900";
    return undefined;
  };

  return (
    <Grid
      templateColumns={templateColumns}
      minW="min-content"
      cursor={!isInactive ? "pointer" : "default"}
      _hover={{ "> div": { bgColor: hoverBg } }}
      onClick={() =>
        !isInactive ??
        window.open(
          `${getProposalUrl(
            currentChainName
          )}/${proposal.proposalId.toString()}`,
          "_blank",
          "noopener,noreferrer"
        )
      }
    >
      <TableRowFreeze left="0">
        <ExplorerLink
          isReadOnly={isInactive}
          type="proposal_id"
          value={proposal.proposalId.toString()}
          showCopyOnHover
        />
      </TableRowFreeze>
      <TableRowFreeze
        left={columnsWidth && columnsWidth[0]}
        boxShadow={boxShadow}
      >
        <ProposalTextCell
          title={proposal.title}
          type={proposal.type}
          isExpedited={proposal.isExpedited}
          isDepositOrVoting={isDepositOrVoting}
        />
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
