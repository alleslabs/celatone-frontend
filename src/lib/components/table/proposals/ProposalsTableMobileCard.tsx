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
      middleContent={
        <Flex gap={3} direction="column">
          <ProposalTextCell
            isExpedited={proposal.isExpedited}
            title={proposal.title}
            types={proposal.types}
            isDepositOrVoting={isDepositOrVoting}
          />
          <Flex gap={1} direction="column">
            <MobileLabel label="Voting Ends" />
            <VotingEndTime
              status={proposal.status}
              depositEndTime={proposal.depositEndTime}
              votingEndTime={proposal.votingEndTime}
            />
          </Flex>
          {!isFullTier && (
            <Flex flex={1} direction="column">
              <MobileLabel label="Proposed by" />
              <Proposer proposer={proposal.proposer} />
            </Flex>
          )}
        </Flex>
      }
      bottomContent={
        isFullTier && (
          <>
            <Flex flex={1} direction="column">
              <MobileLabel label="Resolved Block Height" />
              <ResolvedHeight
                isDepositOrVoting={isDepositOrVoting}
                resolvedHeight={proposal.resolvedHeight}
              />
            </Flex>
            <Flex flex={1} direction="column">
              <MobileLabel label="Proposed by" />
              <Proposer proposer={proposal.proposer} />
            </Flex>
          </>
        )
      }
      onClick={() => onCardSelect(proposal.id)}
      topContent={
        <>
          <Flex align="center" gap={2}>
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
    />
  );
};
