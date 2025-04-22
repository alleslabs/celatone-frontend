import type {
  ProposalData,
  ProposalParams,
  ProposalVotesInfo,
} from "lib/types";

import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { LegendText } from "lib/components/LegendText";
import { Tooltip } from "lib/components/Tooltip";
import {
  extractParams,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import { dateFromNow, formatPrettyPercent, formatUTC } from "lib/utils";
import { isNull } from "lodash";

import { VoteQuorumBadge } from "../../VoteQuorumBadge";
import { VoteQuorumCircle } from "../../VoteQuorumCircle";
import { VoteQuorumText } from "../../VoteQuorumText";

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
    <Flex direction="column" gap={4}>
      <Flex alignItems="center" gap={2}>
        <VoteQuorumBadge
          isCompact
          quorum={quorum}
          status={proposalData.status}
          totalRatio={totalRatio}
        />
        <Text color="text.main" variant="body1">
          Quorum
        </Text>
      </Flex>
      <Divider borderColor="gray.700" />
      <Flex gap={4}>
        <Tooltip
          bgColor="gray.700"
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
        <Flex direction="column" gap={2}>
          <VoteQuorumText
            isCompact
            quorum={quorum}
            status={proposalData.status}
            totalRatio={totalRatio}
          />
          <div>
            <Text color="text.dark" variant="body3">
              Voting ended {endTime ? dateFromNow(endTime) : "N/A"}
            </Text>
            <Text color="text.dark" variant="body3">
              {endTime ? formatUTC(endTime) : "N/A"}
            </Text>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};
