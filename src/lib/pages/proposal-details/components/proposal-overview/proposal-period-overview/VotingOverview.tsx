import { Button, Flex, Text } from "@chakra-ui/react";

import type { ProposalOverviewProps } from "../..";
import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TabIndex, VoteTabIndex } from "lib/pages/proposal-details/types";
import { ProposalStatus } from "lib/types";
import { formatUTC } from "lib/utils";

import { VotingOverviewQuorum } from "./VotingOverviewQuorum";
import { VotingOverviewThreshold } from "./VotingOverviewThreshold";

const VotingOverviewBody = ({
  proposalData,
  params,
  votesInfo,
  isLoading,
}: ProposalOverviewProps) => {
  const navigate = useInternalNavigate();

  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return (
      <Text variant="body2" color="text.dark">
        The proposal will progress to voting period after meet the minimum
        required deposit.
      </Text>
    );
  if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
    return (
      <Text variant="body2" color="text.dark">
        The proposal is rejected as it did not meet the required deposit.
      </Text>
    );
  if (proposalData.status === ProposalStatus.CANCELLED)
    return (
      <Text variant="body2" color="text.dark">
        The proposal was cancelled during the{" "}
        {proposalData.votingTime ? "voting" : "deposit"} period at{" "}
        {proposalData.resolvedTimestamp
          ? formatUTC(proposalData.resolvedTimestamp)
          : "N/A"}
      </Text>
    );

  if (isLoading) return <Loading my={0} />;
  if (!params || !votesInfo) return <ErrorFetchingProposalInfos />;

  return (
    <>
      <VotingOverviewQuorum
        proposalData={proposalData}
        params={params}
        votesInfo={votesInfo}
      />
      <VotingOverviewThreshold
        proposalData={proposalData}
        params={params}
        votesInfo={votesInfo}
      />
      <Button
        variant="ghost-primary"
        rightIcon={<CustomIcon name="chevron-right" />}
        onClick={() =>
          navigate({
            pathname: "/proposals/[id]/[tab]",
            query: {
              id: proposalData.id,
              tab: TabIndex.Vote,
              voteTab: VoteTabIndex.Voting,
            },
            options: {
              shallow: true,
            },
          })
        }
      >
        View Full Vote Details
      </Button>
    </>
  );
};

export const VotingOverview = (props: ProposalOverviewProps) => (
  <Flex direction="column" gap={6} ml={3} px={5} py={4}>
    <VotingOverviewBody {...props} />
  </Flex>
);
