import { Skeleton, Text } from "@chakra-ui/react";
import { isNull } from "lodash";

import type { ProposalOverviewProps } from "..";
import { StatusChip } from "lib/components/table";
import {
  extractParams,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";

export const SummaryStatusChip = ({
  isLoading,
  params,
  proposalData,
  votesInfo,
}: ProposalOverviewProps) => {
  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return <StatusChip isTransparent status={ProposalStatus.DEPOSIT_FAILED} />;

  if (proposalData.status === ProposalStatus.VOTING_PERIOD) {
    if (isLoading) return <Skeleton h={5} w={12} borderRadius={90} />;
    if (params && votesInfo) {
      const { quorum, threshold, vetoThreshold } = extractParams(
        params,
        proposalData.isExpedited
      );
      const { noWithVetoTotalRatio, totalRatio, yesNonRatio } =
        normalizeVotesInfo(votesInfo);

      if (!isNull(totalRatio))
        return (
          <StatusChip
            isTransparent
            status={
              totalRatio >= quorum &&
              noWithVetoTotalRatio < vetoThreshold &&
              yesNonRatio >= threshold
                ? ProposalStatus.PASSED
                : ProposalStatus.REJECTED
            }
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
