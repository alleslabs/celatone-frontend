import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { isNull } from "lodash";

import { VoteQuorumBadge } from "../../VoteQuorumBadge";
import { VoteQuorumCircle } from "../../VoteQuorumCircle";
import { VoteQuorumText } from "../../VoteQuorumText";
import { LegendText } from "lib/components/LegendText";
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
  params: ProposalParams;
  proposalData: ProposalData;
  votesInfo: ProposalVotesInfo;
}

export const VotingOverviewQuorum = ({
  params,
  proposalData,
  votesInfo,
}: VotingOverviewQuorumProps) => {
  const { quorum } = extractParams(params, proposalData.isExpedited);
  const { abstainRatio, nonAbstainRatio, totalRatio } =
    normalizeVotesInfo(votesInfo);

  const endTime = proposalData.resolvedTimestamp ?? proposalData.votingEndTime;
  return (
    <Flex gap={4} direction="column">
      <Flex alignItems="center" gap={2}>
        <VoteQuorumBadge
          status={proposalData.status}
          isCompact
          quorum={quorum}
          totalRatio={totalRatio}
        />
        <Text variant="body1" color="text.main">
          Quorum
        </Text>
      </Flex>
      <Divider borderColor="gray.700" />
      <Flex gap={4}>
        <Tooltip
          hidden={isNull(nonAbstainRatio) || isNull(abstainRatio)}
          label={
            <div>
              <LegendText
                label={`${nonAbstainRatio ? formatPrettyPercent(nonAbstainRatio) : "-"}${" "}
            Vote response`}
                legendColor="voteParticipations.voted"
              />
              <LegendText
                label={`${abstainRatio ? formatPrettyPercent(abstainRatio) : "-"} Vote
                abstain`}
                legendColor="voteParticipations.votedAbstain"
              />
            </div>
          }
          bgColor="gray.700"
        >
          <Box h="fit-content">
            <VoteQuorumCircle
              isCompact
              nonAbstainRatio={nonAbstainRatio}
              quorum={quorum}
              totalRatio={totalRatio}
            />
          </Box>
        </Tooltip>
        <Flex gap={2} direction="column">
          <VoteQuorumText
            status={proposalData.status}
            isCompact
            quorum={quorum}
            totalRatio={totalRatio}
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
