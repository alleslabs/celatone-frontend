import { Box, Divider, Flex, Text } from "@chakra-ui/react";

import { VoteQuorumBadge } from "../../VoteQuorumBadge";
import { VoteQuorumCircle } from "../../VoteQuorumCircle";
import { VoteQuorumText } from "../../VoteQuorumText";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import {
  extractParams,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import type {
  ProposalData,
  ProposalParams,
  ProposalVotesInfo,
} from "lib/types";
import { dateFromNow, formatPrettyPercent, formatUTC } from "lib/utils";

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
  const { abstain, nonAbstainVotes, totalVotes } =
    normalizeVotesInfo(votesInfo);

  const endTime = proposalData.resolvedTimestamp ?? proposalData.votingEndTime;
  return (
    <Flex direction="column" gap={4}>
      <Flex gap={2} alignItems="center">
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
        <Tooltip
          label={
            <div>
              <Flex gap={2}>
                <CustomIcon boxSize="10px" name="circle" color="primary.main" />
                <Text>
                  {formatPrettyPercent(nonAbstainVotes.toNumber())} Vote
                  response
                </Text>
              </Flex>
              <Flex gap={2}>
                <CustomIcon
                  boxSize="10px"
                  name="circle"
                  color="secondary.main"
                />
                <Text>
                  {formatPrettyPercent(abstain.toNumber())} Vote abstain
                </Text>
              </Flex>
            </div>
          }
          bgColor="gray.700"
        >
          <Box h="fit-content">
            <VoteQuorumCircle
              quorum={quorum}
              nonAbstainVotes={nonAbstainVotes}
              totalVotes={totalVotes}
              isCompact
            />
          </Box>
        </Tooltip>
        <Flex direction="column" gap={2}>
          <VoteQuorumText
            status={proposalData.status}
            quorum={quorum}
            totalVotes={totalVotes}
            isCompact
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
