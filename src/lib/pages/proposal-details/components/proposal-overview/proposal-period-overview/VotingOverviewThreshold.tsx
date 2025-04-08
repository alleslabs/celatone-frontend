import type {
  ProposalData,
  ProposalParams,
  ProposalVotesInfo,
} from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { LegendText } from "lib/components/LegendText";
import { StatusChip } from "lib/components/table";
import {
  extractParams,
  getVoteResult,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";
import { formatPrettyPercent } from "lib/utils";

import { VoteThresholdBadge } from "../../VoteThresholdBadge";
import { VoteThresholdBar } from "../../VoteThresholdBar";
import { VpPercentThreshold } from "../../VpPercentThreshold";

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
        borderStyle="solid"
        borderTopColor="gray.700"
        borderTopWidth="1px"
        direction="column"
        gap={4}
        pt={4}
      >
        <Flex alignItems="center" gap={2}>
          <VoteThresholdBadge isCompact status={proposalData.status} />
          {proposalData.status === ProposalStatus.VOTING_PERIOD ? (
            <Text variant="body1" color="text.main">
              Current voting result
            </Text>
          ) : (
            <Flex gap={2} alignItems="center">
              <Text variant="body1" color="text.main">
                Final vote result:
              </Text>
              {proposalData.status === ProposalStatus.FAILED ? (
                <StatusChip status={ProposalStatus.FAILED} />
              ) : (
                <LegendText
                  color="text.main"
                  fontWeight={700}
                  label={result}
                  legendColor={resultColor}
                  variant="body2"
                />
              )}
            </Flex>
          )}
        </Flex>
        <VoteThresholdBar
          isCompact
          threshold={threshold}
          votesInfo={votesInfo}
        />
        <VpPercentThreshold isCompact votesInfo={votesInfo} />
      </Flex>
      {noWithVetoTotalRatio >= vetoThreshold && (
        <Flex
          alignItems="center"
          bgColor="warning.background"
          border="1px solid var(--chakra-colors-warning-dark)"
          borderRadius="8px"
          gap={3}
          p="12px 16px"
        >
          <CustomIcon
            boxSize={4}
            color="warning.main"
            name="alert-triangle-solid"
          />
          <Text color="warning.main" variant="body2">
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
