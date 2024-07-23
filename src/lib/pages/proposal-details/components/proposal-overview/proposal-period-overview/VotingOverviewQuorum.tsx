import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { isNull } from "lodash";

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
  const { abstainRatio, nonAbstainRatio, totalRatio } =
    normalizeVotesInfo(votesInfo);

  const endTime = proposalData.resolvedTimestamp ?? proposalData.votingEndTime;
  return (
    <Flex direction="column" gap={4}>
      <Flex gap={2} alignItems="center">
        <VoteQuorumBadge
          status={proposalData.status}
          quorum={quorum}
          totalRatio={totalRatio}
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
                <CustomIcon
                  boxSize="10px"
                  name="legend"
                  color="voteParticipations.voted"
                />
                <Text>
                  {nonAbstainRatio ? formatPrettyPercent(nonAbstainRatio) : "-"}{" "}
                  Vote response
                </Text>
              </Flex>
              <Flex gap={2}>
                <CustomIcon
                  boxSize="10px"
                  name="legend"
                  color="voteParticipations.votedAbstain"
                />
                <Text>
                  {abstainRatio ? formatPrettyPercent(abstainRatio) : "-"} Vote
                  abstain
                </Text>
              </Flex>
            </div>
          }
          bgColor="gray.700"
          hidden={isNull(nonAbstainRatio) || isNull(abstainRatio)}
        >
          <Box h="fit-content">
            <VoteQuorumCircle
              quorum={quorum}
              nonAbstainRatio={nonAbstainRatio}
              totalRatio={totalRatio}
              isCompact
            />
          </Box>
        </Tooltip>
        <Flex direction="column" gap={2}>
          <VoteQuorumText
            status={proposalData.status}
            quorum={quorum}
            totalRatio={totalRatio}
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
