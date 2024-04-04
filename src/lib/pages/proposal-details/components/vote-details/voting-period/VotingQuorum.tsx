import { Divider, Flex, Heading, Spacer, Text } from "@chakra-ui/react";

import type { VoteDetailsProps } from "..";
import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import { VoteQuorumBadge } from "../../VoteQuorumBadge";
import { VoteQuorumCircle } from "../../VoteQuorumCircle";
import { VoteQuorumText } from "../../VoteQuorumText";
import { VpPercentCard } from "../../VpPercentCard";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import {
  extractParams,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import type { Ratio } from "lib/types";

export const VotingQuorum = ({
  proposalData,
  params,
  votesInfo,
  isLoading,
}: VoteDetailsProps) => {
  const isMobile = useMobile();
  if (isLoading) return <Loading my={0} />;
  if (!params || !votesInfo) return <ErrorFetchingProposalInfos />;

  const { quorum } = extractParams(params, proposalData.isExpedited);
  const { abstain, nonAbstainVotes, totalVotes } =
    normalizeVotesInfo(votesInfo);

  const votes = votesInfo.yes.add(votesInfo.no).add(votesInfo.noWithVeto);
  const allVotes = votes.add(votesInfo.abstain);

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={2} align="center">
        {isMobile ? (
          <>
            <VoteQuorumBadge
              status={proposalData.status}
              quorum={quorum}
              totalVotes={totalVotes}
              isCompact
            />
            <Text variant="body1" color="text.main">
              Quorum
            </Text>
          </>
        ) : (
          <>
            <Heading as="h6" variant="h6" textColor="text.main">
              Voting Participations
            </Heading>
            <VoteQuorumBadge
              status={proposalData.status}
              quorum={quorum}
              totalVotes={totalVotes}
              isCompact={false}
            />
            <Spacer />
            <Text variant="body3" textColor="text.dark">
              * Voting power displayed in bracket
            </Text>
          </>
        )}
      </Flex>
      {isMobile && <Divider borderColor="gray.700" />}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 12 }}
        align="center"
        textAlign={{ base: "center", md: "start" }}
        w="full"
      >
        <VoteQuorumCircle
          quorum={quorum}
          nonAbstainVotes={nonAbstainVotes}
          totalVotes={totalVotes}
          isCompact={false}
          isBgGray={!isMobile}
        />
        <Flex direction="column" gap={4} w="full">
          <VoteQuorumText
            status={proposalData.status}
            quorum={quorum}
            totalVotes={totalVotes}
            isCompact={false}
          />
          <Flex direction={isMobile ? "column" : "row"} gap={isMobile ? 3 : 8}>
            <VpPercentCard
              name="Voted"
              ratio={nonAbstainVotes}
              power={votes}
              color="primary.main"
              isCompact={isMobile}
            />
            <VpPercentCard
              name="Voted Abstain"
              ratio={abstain}
              power={votesInfo.abstain}
              color="secondary.main"
              isCompact={isMobile}
            />
            <Divider
              orientation="vertical"
              h="auto"
              color="gray.700"
              display={{ base: "none", lg: "flex" }}
            />
            <VpPercentCard
              name="Did not vote"
              ratio={(1 - totalVotes) as Ratio<number>}
              power={votesInfo.totalVotingPower.minus(allVotes)}
              color="gray.800"
              isCompact={isMobile}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
