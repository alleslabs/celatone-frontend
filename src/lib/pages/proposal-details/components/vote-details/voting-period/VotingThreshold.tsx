import { Flex, Heading, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { extractParams } from "lib/pages/proposal-details/utils";

import type { VoteDetailsProps } from "..";

import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import { ResultExplanation } from "../../ResultExplanation";
import { VoteThresholdBadge } from "../../VoteThresholdBadge";
import { VoteThresholdBar } from "../../VoteThresholdBar";
import { VpPercentThreshold } from "../../VpPercentThreshold";
import { VotingResult } from "./VotingResult";

const VotingSummaryAlert = () => (
  <Flex alignItems="center" gap={2}>
    <CustomIcon boxSize={4} color="gray.500" name="info-circle-solid" />
    <Text color="gray.500" variant="body2">
      The percentages shown on the bar{" "}
      <Text as="span" color="gray.500" fontWeight={700}>
        exclude Abstain votes
      </Text>
      . Only Yes, No, and No with veto votes are considered.
    </Text>
  </Flex>
);

export const VotingThreshold = ({
  isLoading,
  params,
  proposalData,
  votesInfo,
}: VoteDetailsProps) => {
  const isMobile = useMobile();
  if (isLoading) return <Loading my={0} />;
  if (!params || !votesInfo) return <ErrorFetchingProposalInfos />;

  const { threshold, vetoThreshold } = extractParams(
    params,
    proposalData.isExpedited
  );

  return (
    <Flex direction="column" gap={4}>
      {isMobile ? (
        <>
          <VotingResult
            status={proposalData.status}
            threshold={threshold}
            vetoThreshold={vetoThreshold}
            votesInfo={votesInfo}
          />
          <VoteThresholdBar
            isCompact
            threshold={threshold}
            votesInfo={votesInfo}
          />
          <ResultExplanation
            isLoading={isLoading}
            params={params}
            proposalData={proposalData}
            votesInfo={votesInfo}
          />
          <VpPercentThreshold isCompact votesInfo={votesInfo} />
          <VotingSummaryAlert />
        </>
      ) : (
        <>
          <Flex align="center" gap={2}>
            <Heading as="h6" textColor="text.main" variant="h6">
              Voting results
            </Heading>
            <VoteThresholdBadge
              isCompact={false}
              status={proposalData.status}
            />
          </Flex>
          <Flex align="center" gap={12}>
            <Flex direction="column" flex="2 2 0" gap={4}>
              <VpPercentThreshold isCompact={false} votesInfo={votesInfo} />
              <VoteThresholdBar
                isCompact={false}
                threshold={threshold}
                votesInfo={votesInfo}
              />
              <VotingSummaryAlert />
            </Flex>
            <Flex
              borderLeft="1px solid var(--chakra-colors-gray-700)"
              direction="column"
              flex="1 1 0"
              gap={2}
              h="100%"
              pl={6}
            >
              <VotingResult
                status={proposalData.status}
                threshold={threshold}
                vetoThreshold={vetoThreshold}
                votesInfo={votesInfo}
              />
              <ResultExplanation
                isLoading={isLoading}
                params={params}
                proposalData={proposalData}
                votesInfo={votesInfo}
              />
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  );
};
