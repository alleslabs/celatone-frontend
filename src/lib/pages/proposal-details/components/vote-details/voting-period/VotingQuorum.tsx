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
  const { abstainRatio, nonAbstainRatio, totalRatio } =
    normalizeVotesInfo(votesInfo);

  const { yes, abstain, no, noWithVeto, totalVotingPower } = votesInfo;
  const nonAbstain = yes.add(no).add(noWithVeto);
  const allVotes = nonAbstain.add(abstain);

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={2} align="center">
        {isMobile ? (
          <>
            <VoteQuorumBadge
              status={proposalData.status}
              quorum={quorum}
              totalRatio={totalRatio}
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
              totalRatio={totalRatio}
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
          nonAbstainRatio={nonAbstainRatio}
          totalRatio={totalRatio}
          isCompact={false}
          isBgGray={!isMobile}
        />
        <Flex direction="column" gap={4} w="full">
          <VoteQuorumText
            status={proposalData.status}
            quorum={quorum}
            totalRatio={totalRatio}
            isCompact={false}
          />
          <Flex direction={isMobile ? "column" : "row"} gap={isMobile ? 3 : 8}>
            <VpPercentCard
              name="Voted"
              ratio={nonAbstainRatio}
              power={nonAbstain}
              color="voteParticipations.voted"
              isCompact={isMobile}
            />
            <VpPercentCard
              name="Voted Abstain"
              ratio={abstainRatio}
              power={abstain}
              color="voteParticipations.votedAbstain"
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
              ratio={totalRatio ? ((1 - totalRatio) as Ratio<number>) : null}
              power={totalVotingPower ? totalVotingPower.minus(allVotes) : null}
              color="voteParticipations.didNotVote"
              isCompact={isMobile}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
