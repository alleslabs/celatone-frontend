import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { Proposer } from "../table/proposals/Proposer";
import { ResolvedHeight } from "../table/proposals/ResolvedHeight";
import { StatusChip } from "../table/proposals/StatusChip";
import { VotingEndTime } from "../table/proposals/VotingEndTime";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";

import { DefaultMobileCard } from "./DefaultMobileCard";

export interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard = ({ proposal }: ProposalCardProps) => {
  const isDepositFailed = proposal.status === ProposalStatus.DEPOSIT_FAILED;
  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;
  return (
    <DefaultMobileCard
      topContent={
        <>
          <Flex gap={2} align="center">
            <MobileLabel label="Proposal ID" variant="body2" />
            <ExplorerLink
              isReadOnly={isDepositFailed}
              type="proposal_id"
              value={proposal.proposalId.toString()}
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
            <Text color="text.main" variant="body2">
              {proposal.title}
            </Text>
            <Text color="text.dark" variant="body3">
              Type: {proposal.type}
            </Text>
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
          <Flex direction="column" flex="3">
            <MobileLabel label="Resolved Block Height" />
            <ResolvedHeight
              resolvedHeight={proposal.resolvedHeight}
              isDepositOrVoting={isDepositOrVoting}
              isDepositFailed={isDepositFailed}
            />
          </Flex>
          <Flex direction="column" flex="2">
            <MobileLabel label="Proposed by" />
            <Proposer proposer={proposal.proposer} />
          </Flex>
        </>
      }
    />
  );
};
