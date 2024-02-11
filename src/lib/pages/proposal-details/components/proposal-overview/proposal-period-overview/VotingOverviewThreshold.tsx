import { Flex, Text } from "@chakra-ui/react";

import { VoteThresholdBadge } from "../../VoteThresholdBadge";
import { VoteThresholdBar } from "../../VoteThresholdBar";
import { VpPercentThreshold } from "../../VpPercentThreshold";
import { CustomIcon } from "lib/components/icon";
import { StatusChip } from "lib/components/table";
import {
  extractParams,
  getVoteResult,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import {
  ProposalStatus,
  type ProposalData,
  type ProposalParams,
  type ProposalVotesInfo,
} from "lib/types";

interface VotingOverviewThresholdProps {
  proposalData: ProposalData;
  params: ProposalParams;
  votesInfo: ProposalVotesInfo;
}

export const VotingOverviewThreshold = ({
  proposalData,
  params,
  votesInfo,
}: VotingOverviewThresholdProps) => {
  const { quorum, threshold, vetoThreshold } = extractParams(
    params,
    proposalData.isExpedited
  );
  const { totalVotes } = normalizeVotesInfo(votesInfo);

  const { result, resultColor } = getVoteResult(
    threshold,
    vetoThreshold,
    votesInfo
  );

  return (
    <Flex
      direction="column"
      gap={4}
      ml={4}
      pt={4}
      borderTop="1px solid"
      borderTopColor="gray.700"
    >
      {(proposalData.status === ProposalStatus.VOTING_PERIOD ||
        totalVotes.gte(quorum)) && (
        <Flex gap={1} alignItems="center">
          <VoteThresholdBadge status={proposalData.status} isCompact />
          {proposalData.status === ProposalStatus.VOTING_PERIOD ? (
            <Text variant="body1" color="text.main">
              Current Voting Result
            </Text>
          ) : (
            <Flex gap={2} alignItems="center">
              <Text variant="body1" color="text.main">
                Final Vote Result:
              </Text>
              {proposalData.status === ProposalStatus.FAILED ? (
                <StatusChip status={ProposalStatus.FAILED} />
              ) : (
                <>
                  <CustomIcon
                    name="circle"
                    boxSize="14px"
                    color={resultColor}
                  />
                  <Text variant="body2" color="text.main" fontWeight={700}>
                    {result}
                  </Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      )}
      <VoteThresholdBar threshold={threshold} votesInfo={votesInfo} isCompact />
      <VpPercentThreshold votesInfo={votesInfo} isCompact />
    </Flex>
  );
};
