import { Skeleton, Text } from "@chakra-ui/react";

import type { ProposalOverviewProps } from "..";
import { StatusChip } from "lib/components/table";
import {
  extractParams,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";

export const SummaryStatusChip = ({
  proposalData,
  params,
  votesInfo,
  isLoading,
}: ProposalOverviewProps) => {
  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return <StatusChip status={ProposalStatus.DEPOSIT_FAILED} isTransparent />;

  if (proposalData.status === ProposalStatus.VOTING_PERIOD) {
    if (isLoading) return <Skeleton h={5} w={12} borderRadius={90} />;
    if (!params || !votesInfo)
      return (
        <Text variant="body2" color="text.dark">
          N/A
        </Text>
      );

    const { noWithVeto, yesRatio, totalVotes } = normalizeVotesInfo(votesInfo);
    const { quorum, threshold, vetoThreshold } = extractParams(
      params,
      proposalData.isExpedited
    );
    return (
      <StatusChip
        status={
          totalVotes.gte(quorum) &&
          noWithVeto.lt(vetoThreshold) &&
          yesRatio.gte(threshold)
            ? ProposalStatus.PASSED
            : ProposalStatus.REJECTED
        }
        isTransparent
      />
    );
  }

  return <StatusChip status={proposalData.status} />;
};
