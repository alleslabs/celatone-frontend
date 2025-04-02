import type { Proposal } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { useInternalNavigate, useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ProposalStatus } from "lib/types";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
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
  const { isFullTier } = useTierConfig();
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
      bottomContent={
        isFullTier && (
          <>
            <Flex direction="column" flex={1}>
              <MobileLabel label="Resolved Block Height" />
              <ResolvedHeight
                isDepositOrVoting={isDepositOrVoting}
                resolvedHeight={proposal.resolvedHeight}
              />
            </Flex>
            <Flex direction="column" flex={1}>
              <MobileLabel label="Proposed by" />
              <Proposer proposer={proposal.proposer} />
            </Flex>
          </>
        )
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <ProposalTextCell
            isDepositOrVoting={isDepositOrVoting}
            isExpedited={proposal.isExpedited}
            title={proposal.title}
            types={proposal.types}
          />
          <Flex direction="column" gap={1}>
            <MobileLabel label="Voting Ends" />
            <VotingEndTime
              depositEndTime={proposal.depositEndTime}
              status={proposal.status}
              votingEndTime={proposal.votingEndTime}
            />
          </Flex>
          {!isFullTier && (
            <Flex direction="column" flex={1}>
              <MobileLabel label="Proposed by" />
              <Proposer proposer={proposal.proposer} />
            </Flex>
          )}
        </Flex>
      }
      topContent={
        <>
          <Flex align="center" gap={2}>
            <MobileLabel label="Proposal ID" variant="body2" />
            <ExplorerLink
              showCopyOnHover
              type="proposal_id"
              value={proposal.id.toString()}
            />
          </Flex>
          <StatusChip status={proposal.status} />
        </>
      }
      onClick={() => onCardSelect(proposal.id)}
    />
  );
};
