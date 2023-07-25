import type { DividerProps, GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableRow, TableRowFreeze } from "../tableComponents";
import { useBaseApiRoute, useCelatoneApp } from "lib/app-provider";
import { ExplorerLink, getNavigationUrl } from "lib/components/ExplorerLink";
import { StopPropagationBox } from "lib/components/StopPropagationBox";
import { Proposer } from "lib/components/table/proposals/Proposer";
import { AmpTrackMintscan } from "lib/services/amplitude";
import type { Option, Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";
import { openNewTab } from "lib/utils";

import { ProposalTextCell } from "./ProposalTextCell";
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
  const {
    chainConfig: { explorerLink },
  } = useCelatoneApp();
  const lcdEndpoint = useBaseApiRoute("rest");

  // TODO - Revisit split columnsWidth
  const columnsWidth = templateColumns?.toString().split(" ");
  const isDepositFailed = proposal.status === ProposalStatus.DEPOSIT_FAILED;
  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;

  const hoverBg = (): Option<string> => {
    if (proposal.isExpedited && isDepositOrVoting) return "primary.background";
    return isDepositFailed ? undefined : "gray.900";
  };

  return (
    <Grid
      templateColumns={templateColumns}
      minW="min-content"
      cursor={isDepositFailed ? "default" : "pointer"}
      _hover={{ "> div": { bgColor: hoverBg } }}
      onClick={
        !isDepositFailed
          ? () => {
              AmpTrackMintscan("proposal-detail", {
                type: proposal.type,
                status: proposal.status,
              });
              // TOOD: revisit retrieving url (make a proper hook)
              openNewTab(
                getNavigationUrl(
                  "proposal_id",
                  explorerLink,
                  proposal.proposalId.toString(),
                  lcdEndpoint
                )
              );
            }
          : undefined
      }
    >
      <TableRowFreeze left="0">
        <ExplorerLink
          isReadOnly={isDepositFailed}
          type="proposal_id"
          value={proposal.proposalId.toString()}
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
          type={proposal.type}
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
  );
};
