import type { DividerProps, GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { ProposalTextCell } from "../components/ProposalTextCell";
import { getProposalUrl } from "lib/app-fns/explorer";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow, TableRowFreeze } from "lib/components/table";
import { Proposer } from "lib/components/table/proposals/Proposer";
import { ResolvedHeight } from "lib/components/table/proposals/ResolvedHeight";
import { StatusChip } from "lib/components/table/proposals/StatusChip";
import { VotingEndTime } from "lib/components/table/proposals/VotingEndTime";
import type { Proposal, Option } from "lib/types";
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

  // TODO - Revisit split columnsWidth
  const columnsWidth = templateColumns?.toString().split(" ");
  const isDepositFailed = proposal.status === ProposalStatus.DEPOSIT_FAILED;
  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;

  const hoverBg = (): Option<string> => {
    if (proposal.isExpedited && isDepositOrVoting) return "violet.background";
    return isDepositFailed ? undefined : "pebble.900";
  };

  return (
    <Grid
      templateColumns={templateColumns}
      minW="min-content"
      cursor={isDepositFailed ? "default" : "pointer"}
      _hover={{ "> div": { bgColor: hoverBg } }}
      onClick={() =>
        !isDepositFailed &&
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
          isReadOnly={isDepositFailed}
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
          isDepositFailed={isDepositFailed}
          isDepositOrVoting={isDepositOrVoting}
        />
      </TableRow>
      <TableRow>
        <Proposer proposer={proposal.proposer} />
      </TableRow>
    </Grid>
  );
};
