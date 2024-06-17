import {
  Accordion,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { isNull } from "lodash";

import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { ProposalStatus } from "lib/types";
import type {
  Option,
  ProposalData,
  ProposalParams,
  ProposalVotesInfo,
} from "lib/types";

import { DepositPeriodSection } from "./deposit-period/DepositPeriodSection";
import { VoteDetailsAccordionItem } from "./VoteDetailsAccordionItem";
import { VoteDetailsTab } from "./VoteDetailsTab";
import { VotingPeriod } from "./voting-period";

const trackPeriodSubtab = (index: number) =>
  track(AmpEvent.USE_SUBTAB, {
    currentTab: index === 0 ? "deposit" : "voting",
  });

export interface VoteDetailsProps {
  proposalData: ProposalData;
  votesInfo: Option<ProposalVotesInfo>;
  params: Option<ProposalParams>;
  isLoading: boolean;
  isDepositsLoading: boolean;
}

export const VoteDetails = ({ proposalData, ...props }: VoteDetailsProps) => {
  const isMobile = useMobile();

  const isDepositOnly =
    proposalData.status === ProposalStatus.DEPOSIT_FAILED ||
    proposalData.status === ProposalStatus.DEPOSIT_PERIOD ||
    (proposalData.status === ProposalStatus.CANCELLED &&
      isNull(proposalData.votingTime));

  const subtabIndex = isDepositOnly ? 0 : 1;

  return isMobile ? (
    <Accordion
      allowToggle
      w="full"
      variant="transparent"
      defaultIndex={[subtabIndex]}
      onChange={(expandedIndex: number) => {
        if (expandedIndex === -1) return;
        trackPeriodSubtab(expandedIndex);
      }}
    >
      <VoteDetailsAccordionItem step={1} proposalData={proposalData}>
        <DepositPeriodSection proposalData={proposalData} {...props} />
      </VoteDetailsAccordionItem>
      <VoteDetailsAccordionItem
        step={2}
        proposalData={proposalData}
        isDisabled={isDepositOnly}
      >
        <VotingPeriod proposalData={proposalData} {...props} />
      </VoteDetailsAccordionItem>
    </Accordion>
  ) : (
    <Tabs
      isLazy
      lazyBehavior="keepMounted"
      mt={6}
      w="full"
      defaultIndex={subtabIndex}
      onChange={(index) => trackPeriodSubtab(index)}
    >
      <TabList borderBottom="0px solid" gap={2}>
        <VoteDetailsTab step={1} proposalData={proposalData} />
        <VoteDetailsTab
          step={2}
          proposalData={proposalData}
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
          <DepositPeriodSection proposalData={proposalData} {...props} />
        </TabPanel>
        <TabPanel>
          <VotingPeriod proposalData={proposalData} {...props} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
