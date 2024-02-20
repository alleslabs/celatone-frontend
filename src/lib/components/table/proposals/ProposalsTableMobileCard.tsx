import { Flex, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate } from "lib/app-provider";
import { Expedited } from "lib/components/Expedited";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";

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
          <Flex direction="column" gap={1}>
            <MobileLabel label="Proposal Title" />
            <Text color="text.main" variant="body2" wordBreak="break-word">
              {proposal.title}
              {proposal.isExpedited && (
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: "8px",
                    verticalAlign: "middle",
                  }}
                >
                  <Expedited isActiveExpedited={isDepositOrVoting} />
                </span>
              )}
            </Text>
            {proposal.types.length ? (
              proposal.types.map((msgType, index) => (
                <Text
                  key={msgType + index.toString()}
                  variant="body3"
                  color="text.dark"
                  wordBreak="break-word"
                >
                  {msgType}
                </Text>
              ))
            ) : (
              <Text variant="body3" color="text.dark">
                (No message)
              </Text>
            )}
          </Flex>
          <Flex direction="column" gap={1}>
            <MobileLabel label="Voting Ends" />
            <VotingEndTime
              votingEndTime={proposal.votingEndTime}
              depositEndTime={proposal.depositEndTime}
              status={proposal.status}
            />
          </Flex>
        </Flex>
      }
      bottomContent={
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
      }
      onClick={() => onCardSelect(proposal.id)}
    />
  );
};
