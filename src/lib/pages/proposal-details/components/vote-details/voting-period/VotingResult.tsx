import { Flex, Text } from "@chakra-ui/react";

import { LegendText } from "lib/components/LegendText";
import { StatusChip } from "lib/components/table";
import { getVoteResult } from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";
import type { ProposalVotesInfo } from "lib/types";

interface VotingResultProps {
  status: ProposalStatus;
  threshold: number;
  vetoThreshold: number;
  votesInfo: ProposalVotesInfo;
}

export const VotingResult = ({
  status,
  threshold,
  vetoThreshold,
  votesInfo,
}: VotingResultProps) => {
  const { result, resultColor } = getVoteResult(
    threshold,
    vetoThreshold,
    votesInfo
  );

  return (
    <Flex gap={2} alignItems="center">
      <Text variant="body1" color="text.main" fontWeight={700}>
        {status === ProposalStatus.VOTING_PERIOD ? "Current" : "Final"} voting
        result:
      </Text>
      {status === ProposalStatus.FAILED ? (
        <StatusChip status={ProposalStatus.FAILED} />
      ) : (
        <LegendText
          label={result}
          legendColor={resultColor}
          variant="body2"
          color="text.main"
          fontWeight={700}
        />
      )}
    </Flex>
  );
};
