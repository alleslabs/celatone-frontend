import { Divider, Flex, Text } from "@chakra-ui/react";

import { VoteQuorumBadge } from "../../VoteQuorumBadge";
import { VoteQuorumCircle } from "../../VoteQuorumCircle";
import {
  extractParams,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import type {
  ProposalData,
  ProposalParams,
  ProposalVotesInfo,
} from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { VotingOverviewQuorumText } from "./VotingOverviewQuorumText";

interface VotingOverviewQuorumProps {
  proposalData: ProposalData;
  params: ProposalParams;
  votesInfo: ProposalVotesInfo;
}

export const VotingOverviewQuorum = ({
  proposalData,
  params,
  votesInfo,
}: VotingOverviewQuorumProps) => {
  const { quorum } = extractParams(params, proposalData.isExpedited);
  const { nonAbstainVotes, totalVotes } = normalizeVotesInfo(votesInfo);

  const endTime = proposalData.resolvedTimestamp ?? proposalData.votingEndTime;
  return (
    <Flex direction="column" ml={4} gap={4}>
      <Flex gap={1} alignItems="center">
        <VoteQuorumBadge
          status={proposalData.status}
          quorum={quorum}
          totalVotes={totalVotes}
          isCompact
        />
        <Text variant="body1" color="text.main">
          Quorum
        </Text>
      </Flex>
      <Divider borderColor="gray.700" />
      <Flex gap={4}>
        <VoteQuorumCircle
          quorum={quorum}
          nonAbstainVotes={nonAbstainVotes}
          totalVotes={totalVotes}
          isCompact
        />
        <Flex direction="column" gap={2}>
          <VotingOverviewQuorumText
            status={proposalData.status}
            quorum={quorum}
            totalVotes={totalVotes}
          />
          <div>
            <Text variant="body3" color="text.dark">
              Voting ended {endTime ? dateFromNow(endTime) : "N/A"}
            </Text>
            <Text variant="body3" color="text.dark">
              {endTime ? formatUTC(endTime) : "N/A"}
            </Text>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};
