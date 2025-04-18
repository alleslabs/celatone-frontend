import type { Ratio } from "lib/types";

import { Divider, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import {
  extractParams,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";

import type { VoteDetailsProps } from "..";

import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import { VoteQuorumBadge } from "../../VoteQuorumBadge";
import { VoteQuorumCircle } from "../../VoteQuorumCircle";
import { VoteQuorumText } from "../../VoteQuorumText";
import { VpPercentCard } from "../../VpPercentCard";

export const VotingQuorum = ({
  isLoading,
  params,
  proposalData,
  votesInfo,
}: VoteDetailsProps) => {
  const isMobile = useMobile();
  if (isLoading) return <Loading my={0} />;
  if (!params || !votesInfo) return <ErrorFetchingProposalInfos />;

  const { quorum } = extractParams(params, proposalData.isExpedited);
  const { abstainRatio, nonAbstainRatio, totalRatio } =
    normalizeVotesInfo(votesInfo);

  const { abstain, no, noWithVeto, totalVotingPower, yes } = votesInfo;
  const nonAbstain = yes.add(no).add(noWithVeto);
  const allVotes = nonAbstain.add(abstain);

  return (
    <Flex direction="column" gap={4}>
      <Flex align="center" gap={2}>
        {isMobile ? (
          <>
            <VoteQuorumBadge
              isCompact
              quorum={quorum}
              status={proposalData.status}
              totalRatio={totalRatio}
            />
            <Text color="text.main" variant="body1">
              Quorum
            </Text>
          </>
        ) : (
          <>
            <Heading as="h6" textColor="text.main" variant="h6">
              Voting participations
            </Heading>
            <VoteQuorumBadge
              isCompact={false}
              quorum={quorum}
              status={proposalData.status}
              totalRatio={totalRatio}
            />
            <Spacer />
            <Text textColor="text.dark" variant="body3">
              * Voting power displayed in bracket
            </Text>
          </>
        )}
      </Flex>
      {isMobile && <Divider borderColor="gray.700" />}
      <Flex
        align="center"
        direction={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 12 }}
        textAlign={{ base: "center", md: "start" }}
        w="full"
      >
        <VoteQuorumCircle
          isBgGray={!isMobile}
          isCompact={false}
          nonAbstainRatio={nonAbstainRatio}
          quorum={quorum}
          totalRatio={totalRatio}
        />
        <Flex direction="column" gap={4} w="full">
          <VoteQuorumText
            isCompact={false}
            quorum={quorum}
            status={proposalData.status}
            totalRatio={totalRatio}
          />
          <Flex direction={isMobile ? "column" : "row"} gap={isMobile ? 3 : 8}>
            <VpPercentCard
              color="voteParticipations.voted"
              isCompact={isMobile}
              name="Voted"
              power={nonAbstain}
              ratio={nonAbstainRatio}
            />
            <VpPercentCard
              color="voteParticipations.votedAbstain"
              isCompact={isMobile}
              name="Voted abstain"
              power={abstain}
              ratio={abstainRatio}
            />
            <Divider
              color="gray.700"
              display={{ base: "none", lg: "flex" }}
              h="auto"
              orientation="vertical"
            />
            <VpPercentCard
              color="voteParticipations.didNotVote"
              isCompact={isMobile}
              name="Did not vote"
              power={totalVotingPower ? totalVotingPower.minus(allVotes) : null}
              ratio={totalRatio ? ((1 - totalRatio) as Ratio<number>) : null}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
