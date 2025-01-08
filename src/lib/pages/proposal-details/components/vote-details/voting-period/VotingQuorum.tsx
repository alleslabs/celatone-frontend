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
    <Flex gap={4} direction="column">
      <Flex align="center" gap={2}>
        {isMobile ? (
          <>
            <VoteQuorumBadge
              status={proposalData.status}
              isCompact
              quorum={quorum}
              totalRatio={totalRatio}
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
              isCompact={false}
              quorum={quorum}
              totalRatio={totalRatio}
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
        align="center"
        gap={{ base: 3, md: 12 }}
        textAlign={{ base: "center", md: "start" }}
        w="full"
        direction={{ base: "column", md: "row" }}
      >
        <VoteQuorumCircle
          isBgGray={!isMobile}
          isCompact={false}
          nonAbstainRatio={nonAbstainRatio}
          quorum={quorum}
          totalRatio={totalRatio}
        />
        <Flex gap={4} w="full" direction="column">
          <VoteQuorumText
            status={proposalData.status}
            isCompact={false}
            quorum={quorum}
            totalRatio={totalRatio}
          />
          <Flex gap={isMobile ? 3 : 8} direction={isMobile ? "column" : "row"}>
            <VpPercentCard
              name="Voted"
              color="voteParticipations.voted"
              isCompact={isMobile}
              power={nonAbstain}
              ratio={nonAbstainRatio}
            />
            <VpPercentCard
              name="Voted Abstain"
              color="voteParticipations.votedAbstain"
              isCompact={isMobile}
              power={abstain}
              ratio={abstainRatio}
            />
            <Divider
              display={{ base: "none", lg: "flex" }}
              h="auto"
              color="gray.700"
              orientation="vertical"
            />
            <VpPercentCard
              name="Did not vote"
              color="voteParticipations.didNotVote"
              isCompact={isMobile}
              power={totalVotingPower ? totalVotingPower.minus(allVotes) : null}
              ratio={totalRatio ? ((1 - totalRatio) as Ratio<number>) : null}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
