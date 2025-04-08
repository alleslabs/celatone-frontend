import { Flex, Heading } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { extractParams } from "lib/pages/proposal-details/utils";

import type { VoteDetailsProps } from "..";

import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import { ResultExplanation } from "../../ResultExplanation";
import { VoteThresholdBadge } from "../../VoteThresholdBadge";
import { VoteThresholdBar } from "../../VoteThresholdBar";
import { VpPercentThreshold } from "../../VpPercentThreshold";
import { VotingResult } from "./VotingResult";

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
              <VoteThresholdBar
                isCompact={false}
                threshold={threshold}
                votesInfo={votesInfo}
              />
              <VpPercentThreshold isCompact={false} votesInfo={votesInfo} />
            </Flex>
            <Flex
              borderColor="gray.700"
              borderLeftWidth="1px"
              borderStyle="solid"
              direction="column"
              flex="1 1 0"
              gap={2}
              h="fit-content"
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
