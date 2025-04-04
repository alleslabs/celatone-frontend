import { Flex, Heading } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { extractParams } from "lib/pages/proposal-details/utils";
import { VotingResult } from "./VotingResult";
import type { VoteDetailsProps } from "..";
import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import { ResultExplanation } from "../../ResultExplanation";
import { VoteThresholdBadge } from "../../VoteThresholdBadge";
import { VoteThresholdBar } from "../../VoteThresholdBar";
import { VpPercentThreshold } from "../../VpPercentThreshold";

export const VotingThreshold = ({
  proposalData,
  params,
  votesInfo,
  isLoading,
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
            threshold={threshold}
            votesInfo={votesInfo}
            isCompact
          />
          <ResultExplanation
            proposalData={proposalData}
            params={params}
            votesInfo={votesInfo}
            isLoading={isLoading}
          />
          <VpPercentThreshold votesInfo={votesInfo} isCompact />
        </>
      ) : (
        <>
          <Flex gap={2} align="center">
            <Heading as="h6" variant="h6" textColor="text.main">
              Voting results
            </Heading>
            <VoteThresholdBadge
              status={proposalData.status}
              isCompact={false}
            />
          </Flex>
          <Flex gap={12} align="center">
            <Flex flex="2 2 0" direction="column" gap={4}>
              <VoteThresholdBar
                threshold={threshold}
                votesInfo={votesInfo}
                isCompact={false}
              />
              <VpPercentThreshold votesInfo={votesInfo} isCompact={false} />
            </Flex>
            <Flex
              flex="1 1 0"
              direction="column"
              gap={2}
              pl={6}
              h="fit-content"
              borderLeft="1px solid var(--chakra-colors-gray-700)"
            >
              <VotingResult
                status={proposalData.status}
                threshold={threshold}
                vetoThreshold={vetoThreshold}
                votesInfo={votesInfo}
              />
              <ResultExplanation
                proposalData={proposalData}
                params={params}
                votesInfo={votesInfo}
                isLoading={isLoading}
              />
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  );
};
