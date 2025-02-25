import { Skeleton, Text } from "@chakra-ui/react";
import { isNull } from "lodash";

import { StatusChip } from "lib/components/table";
import {
  extractParams,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";
import type { ProposalOverviewProps } from "..";

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
    if (params && votesInfo) {
      const { quorum, threshold, vetoThreshold } = extractParams(
        params,
        proposalData.isExpedited
      );
      const { totalRatio, yesNonRatio, noWithVetoTotalRatio } =
        normalizeVotesInfo(votesInfo);

      if (!isNull(totalRatio))
        return (
          <StatusChip
            status={
              totalRatio >= quorum &&
              noWithVetoTotalRatio < vetoThreshold &&
              yesNonRatio >= threshold
                ? ProposalStatus.PASSED
                : ProposalStatus.REJECTED
            }
            isTransparent
          />
        );
    }
    return (
      <Text variant="body2" color="text.dark">
        N/A
      </Text>
    );
  }

  return <StatusChip status={proposalData.status} />;
};
