import { Button, Flex, Text } from "@chakra-ui/react";
import { isNull } from "lodash";

import type { ProposalOverviewProps } from "..";
import { DepositBar } from "../../deposit-bar";
import { DepositList } from "../../DepositList";
import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TabIndex } from "lib/pages/proposal-details/types";
import { extractParams } from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";
import { formatUTC } from "lib/utils";

const DepositOverviewBody = ({
  isDepositsLoading,
  isLoading,
  params,
  proposalData,
}: Omit<ProposalOverviewProps, "votesInfo">) => {
  const navigate = useInternalNavigate();

  if (
    proposalData.status !== ProposalStatus.DEPOSIT_FAILED &&
    proposalData.status !== ProposalStatus.DEPOSIT_PERIOD &&
    !(
      proposalData.status === ProposalStatus.CANCELLED &&
      isNull(proposalData.votingTime)
    )
  )
    return (
      <Text variant="body2" color="text.dark">
        The proposal passed the deposit period at{" "}
        {proposalData.votingTime ? formatUTC(proposalData.votingTime) : "N/A"}
      </Text>
    );

  if (isLoading) return <Loading my={0} />;
  if (!params) return <ErrorFetchingProposalInfos isParamsOnly />;

  const { minDeposit } = extractParams(params, proposalData.isExpedited);
  return (
    <>
      {proposalData.status === ProposalStatus.DEPOSIT_PERIOD && (
        <DepositBar
          deposit={proposalData.totalDeposit}
          isCompact
          isDepositOrVoting
          minDeposit={minDeposit}
        />
      )}
      <DepositList
        isDepositsLoading={isDepositsLoading}
        proposalDeposits={proposalData.proposalDeposits.slice(0, 5)}
      />
      {proposalData.proposalDeposits.length > 0 && (
        <Button
          variant="ghost-primary"
          onClick={() =>
            navigate({
              options: {
                shallow: true,
              },
              pathname: "/proposals/[proposalId]/[tab]",
              query: {
                proposalId: proposalData.id,
                tab: TabIndex.Vote,
              },
            })
          }
          rightIcon={<CustomIcon name="chevron-right" />}
        >
          View All Depositors ({proposalData.proposalDeposits.length})
        </Button>
      )}
    </>
  );
};

export const DepositOverview = (
  props: Omit<ProposalOverviewProps, "votesInfo">
) => (
  <Flex
    gap={4}
    ml={3}
    px={5}
    py={4}
    borderLeft="1px solid var(--chakra-colors-gray-600)"
    direction="column"
  >
    <DepositOverviewBody {...props} />
  </Flex>
);
