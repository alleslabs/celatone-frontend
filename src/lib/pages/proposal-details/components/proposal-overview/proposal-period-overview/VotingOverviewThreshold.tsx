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
import { ProposalStatus } from "lib/types";
import type {
  ProposalData,
  ProposalParams,
  ProposalVotesInfo,
} from "lib/types";
import { formatPrettyPercent } from "lib/utils";

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
  const { threshold, vetoThreshold } = extractParams(
    params,
    proposalData.isExpedited
  );
  const { noWithVetoTotalRatio } = normalizeVotesInfo(votesInfo);

  const { result, resultColor } = getVoteResult(
    threshold,
    vetoThreshold,
    votesInfo
  );

  return (
    <>
      <Flex
        direction="column"
        gap={4}
        pt={4}
        borderTop="1px solid"
        borderTopColor="gray.700"
      >
        <Flex gap={2} alignItems="center">
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
                    name="legend"
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
        <VoteThresholdBar
          threshold={threshold}
          votesInfo={votesInfo}
          isCompact
        />
        <VpPercentThreshold votesInfo={votesInfo} isCompact />
      </Flex>
      {noWithVetoTotalRatio >= vetoThreshold && (
        <Flex
          gap={3}
          p="12px 16px"
          bgColor="warning.background"
          border="1px solid var(--chakra-colors-warning-dark)"
          borderRadius="8px"
          alignItems="center"
        >
          <CustomIcon
            boxSize={4}
            name="alert-triangle-solid"
            color="warning.main"
          />
          <Text variant="body2" color="warning.main">
            {proposalData.status === ProposalStatus.VOTING_PERIOD ? (
              <>
                Currently, the &ldquo;No with veto&rdquo; vote proportion
                constitutes{" "}
                <span
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {formatPrettyPercent(noWithVetoTotalRatio)}{" "}
                </span>
                of the total votes, including &ldquo;Abstain&rdquo;, which
                exceeds the{" "}
                <span
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {formatPrettyPercent(vetoThreshold)} threshold
                </span>
                . If the proposal concludes with this voting outcome, it will be
                regardless of &ldquo;Yes&rdquo; votes.
              </>
            ) : (
              <>
                Due to the &ldquo;No with veto&rdquo; vote proportion
                constitutes{" "}
                <span
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {formatPrettyPercent(noWithVetoTotalRatio)}{" "}
                </span>
                of the total votes including &ldquo;Abstain&rdquo;, which
                exceeds the{" "}
                <span
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {formatPrettyPercent(vetoThreshold)} threshold
                </span>
                , the proposal is rejected regardless of &ldquo;Yes&rdquo;
                votes.
              </>
            )}
          </Text>
        </Flex>
      )}
    </>
  );
};
