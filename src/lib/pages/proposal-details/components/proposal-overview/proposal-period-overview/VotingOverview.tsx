import { Button, Flex, Text } from "@chakra-ui/react";
import { useGovConfig, useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TabIndex } from "lib/pages/proposal-details/types";
import { ProposalStatus } from "lib/types";
import { formatUTC } from "lib/utils";

import type { ProposalOverviewProps } from "..";

import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import { NoVotingPeriodTallyAlert } from "../../NoVotingPeriodTally";
import { VotingOverviewQuorum } from "./VotingOverviewQuorum";
import { VotingOverviewThreshold } from "./VotingOverviewThreshold";

const VotingOverviewBody = ({
  proposalData,
  params,
  votesInfo,
  isLoading,
}: ProposalOverviewProps) => {
  const navigate = useInternalNavigate();

  const gov = useGovConfig({ shouldRedirect: false });
  const disableVotingPeriodTally = gov.enabled && gov.disableVotingPeriodTally;

  if (
    proposalData.status === ProposalStatus.VOTING_PERIOD &&
    disableVotingPeriodTally
  )
    return <NoVotingPeriodTallyAlert />;

  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return (
      <Text color="text.dark" variant="body2">
        The proposal will progress to voting period after meet the minimum
        required deposit.
      </Text>
    );
  if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
    return (
      <Text color="text.dark" variant="body2">
        The proposal is rejected as it did not meet the required deposit.
      </Text>
    );
  if (proposalData.status === ProposalStatus.CANCELLED)
    return (
      <Text color="text.dark" variant="body2">
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
        params={params}
        proposalData={proposalData}
        votesInfo={votesInfo}
      />
      <VotingOverviewThreshold
        params={params}
        proposalData={proposalData}
        votesInfo={votesInfo}
      />
      <Button
        rightIcon={<CustomIcon name="chevron-right" />}
        variant="ghost-primary"
        onClick={() =>
          navigate({
            pathname: "/proposals/[proposalId]/[tab]",
            query: {
              proposalId: proposalData.id,
              tab: TabIndex.Vote,
            },
            options: {
              shallow: true,
            },
          })
        }
      >
        View full voting details
      </Button>
    </>
  );
};

export const VotingOverview = (props: ProposalOverviewProps) => (
  <Flex direction="column" gap={6} ml={3} px={5} py={4}>
    <VotingOverviewBody {...props} />
  </Flex>
);
