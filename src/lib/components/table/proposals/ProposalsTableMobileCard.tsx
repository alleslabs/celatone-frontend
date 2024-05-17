import { Flex } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate, useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";

import { ProposalTextCell } from "./ProposalTextCell";
import { Proposer } from "./Proposer";
import { ResolvedHeight } from "./ResolvedHeight";
import { StatusChip } from "./StatusChip";
import { VotingEndTime } from "./VotingEndTime";

export interface ProposalsTableMobileCardProps {
  proposal: Proposal;
}

export const ProposalsTableMobileCard = ({
  proposal,
}: ProposalsTableMobileCardProps) => {
  const isFullTier = useTierConfig() === "full";
  const navigate = useInternalNavigate();

  const onCardSelect = (proposalId: number) =>
    navigate({
      pathname: "/proposals/[proposalId]",
      query: { proposalId },
    });

  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;
  return (
    <MobileCardTemplate
      topContent={
        <>
          <Flex gap={2} align="center">
            <MobileLabel label="Proposal ID" variant="body2" />
            <ExplorerLink
              type="proposal_id"
              value={proposal.id.toString()}
              showCopyOnHover
            />
          </Flex>
          <StatusChip status={proposal.status} />
        </>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <ProposalTextCell
            title={proposal.title}
            types={proposal.types}
            isExpedited={proposal.isExpedited}
            isDepositOrVoting={isDepositOrVoting}
          />
          <Flex direction="column" gap={1}>
            <MobileLabel label="Voting Ends" />
            <VotingEndTime
              votingEndTime={proposal.votingEndTime}
              depositEndTime={proposal.depositEndTime}
              status={proposal.status}
            />
          </Flex>
          {!isFullTier && (
            <Flex direction="column" flex="1">
              <MobileLabel label="Proposed by" />
              <Proposer proposer={proposal.proposer} />
            </Flex>
          )}
        </Flex>
      }
      bottomContent={
        isFullTier && (
          <>
            <Flex direction="column" flex="1">
              <MobileLabel label="Resolved Block Height" />
              <ResolvedHeight
                resolvedHeight={proposal.resolvedHeight}
                isDepositOrVoting={isDepositOrVoting}
              />
            </Flex>
            <Flex direction="column" flex="1">
              <MobileLabel label="Proposed by" />
              <Proposer proposer={proposal.proposer} />
            </Flex>
          </>
        )
      }
      onClick={() => onCardSelect(proposal.id)}
    />
  );
};
