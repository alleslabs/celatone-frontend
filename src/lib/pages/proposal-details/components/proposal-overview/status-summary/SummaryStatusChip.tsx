import { Skeleton, Text } from "@chakra-ui/react";
import { StatusChip } from "lib/components/table";
import {
  extractParams,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";
import { isNull } from "lodash";

import type { ProposalOverviewProps } from "..";

export const SummaryStatusChip = ({
  proposalData,
  params,
  votesInfo,
  isLoading,
}: ProposalOverviewProps) => {
  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return <StatusChip isTransparent status={ProposalStatus.DEPOSIT_FAILED} />;

  if (proposalData.status === ProposalStatus.VOTING_PERIOD) {
    if (isLoading) return <Skeleton borderRadius={90} h={5} w={12} />;
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
      <Text color="text.dark" variant="body2">
        N/A
      </Text>
    );
  }

  return <StatusChip status={proposalData.status} />;
};
