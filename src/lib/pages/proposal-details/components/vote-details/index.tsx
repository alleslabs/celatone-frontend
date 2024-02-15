import {
  Accordion,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { isNull } from "lodash";
import { useCallback, useEffect } from "react";

import { PeriodIndex, TabIndex } from "../../types";
import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import {
  ProposalStatus,
  type Option,
  type ProposalData,
  type ProposalParams,
  type ProposalVotesInfo,
} from "lib/types";

import { DepositPeriodSection } from "./deposit-period/DepositPeriodSection";
import { VoteDetailsAccordionItem } from "./VoteDetailsAccordionItem";
import { VoteDetailsTab } from "./VoteDetailsTab";
import { VotingPeriod } from "./voting-period";

export interface VoteDetailsProps {
  proposalData: ProposalData;
  votesInfo: Option<ProposalVotesInfo>;
  params: Option<ProposalParams>;
  isLoading: boolean;
  period?: PeriodIndex;
}

export const VoteDetails = ({
  proposalData,
  period,
  ...props
}: VoteDetailsProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const isDepositOnly =
    proposalData.status === ProposalStatus.DEPOSIT_FAILED ||
    proposalData.status === ProposalStatus.DEPOSIT_PERIOD ||
    (proposalData.status === ProposalStatus.CANCELLED &&
      isNull(proposalData.votingTime));

  const periodTab =
    period ?? (isDepositOnly ? PeriodIndex.Deposit : PeriodIndex.Voting);
  const periodTabIndex = Object.values(PeriodIndex).indexOf(periodTab);

  const handleTabChange = useCallback(
    (nextSubTab: PeriodIndex) => () => {
      if (nextSubTab === periodTab) return;
      track(AmpEvent.USE_SUBTAB, { currentTab: periodTab });
      navigate({
        pathname: "/proposals/[id]/[tab]",
        query: {
          id: proposalData.id,
          tab: TabIndex.Vote,
          period: nextSubTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [navigate, periodTab, proposalData.id]
  );

  useEffect(() => {
    if (period === PeriodIndex.Voting && isDepositOnly)
      handleTabChange(PeriodIndex.Deposit)();
  }, [handleTabChange, isDepositOnly, period]);

  return isMobile ? (
    <Flex>
      <Accordion
        allowToggle
        w="full"
        variant="transparent"
        index={[periodTabIndex]}
      >
        <VoteDetailsAccordionItem
          step={1}
          proposalData={proposalData}
          onClick={handleTabChange(PeriodIndex.Deposit)}
        >
          <DepositPeriodSection />
        </VoteDetailsAccordionItem>
        <VoteDetailsAccordionItem
          step={2}
          proposalData={proposalData}
          onClick={handleTabChange(PeriodIndex.Voting)}
          isDisabled={isDepositOnly}
        >
          <VotingPeriod proposalData={proposalData} {...props} />
        </VoteDetailsAccordionItem>
      </Accordion>
    </Flex>
  ) : (
    <Flex mt={8}>
      {/* To add index to Tabs */}
      <Tabs isLazy lazyBehavior="keepMounted" w="full" index={periodTabIndex}>
        <TabList borderBottom="0px solid" gap={2}>
          <VoteDetailsTab
            step={1}
            proposalData={proposalData}
            onClick={handleTabChange(PeriodIndex.Deposit)}
          />
          <VoteDetailsTab
            step={2}
            proposalData={proposalData}
            onClick={handleTabChange(PeriodIndex.Voting)}
            isDisabled={isDepositOnly}
          />
        </TabList>
        <TabPanels
          background="gray.800"
          border="1px solid"
          borderColor="gray.700"
          borderTopColor="transparent"
          borderRadius="0px 0px 8px 8px"
        >
          <TabPanel>
            <DepositPeriodSection />
          </TabPanel>
          <TabPanel>
            <VotingPeriod proposalData={proposalData} {...props} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
