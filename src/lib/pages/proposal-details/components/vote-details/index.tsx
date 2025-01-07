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
  isDepositsLoading: boolean;
  isLoading: boolean;
  params: Option<ProposalParams>;
  proposalData: ProposalData;
  votesInfo: Option<ProposalVotesInfo>;
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
      defaultIndex={[subtabIndex]}
      variant="transparent"
      w="full"
      allowToggle
      onChange={(expandedIndex: number) => {
        if (expandedIndex === -1) return;
        trackPeriodSubtab(expandedIndex);
      }}
    >
      <VoteDetailsAccordionItem step={1} proposalData={proposalData}>
        <DepositPeriodSection proposalData={proposalData} {...props} />
      </VoteDetailsAccordionItem>
      <VoteDetailsAccordionItem
        isDisabled={isDepositOnly}
        step={2}
        proposalData={proposalData}
      >
        <VotingPeriod proposalData={proposalData} {...props} />
      </VoteDetailsAccordionItem>
    </Accordion>
  ) : (
    <Tabs
      defaultIndex={subtabIndex}
      isLazy
      mt={6}
      w="full"
      lazyBehavior="keepMounted"
      onChange={(index) => trackPeriodSubtab(index)}
    >
      <TabList gap={2} borderBottom="0px solid">
        <VoteDetailsTab step={1} proposalData={proposalData} />
        <VoteDetailsTab
          isDisabled={isDepositOnly}
          step={2}
          proposalData={proposalData}
        />
      </TabList>
      <TabPanels
        background="gray.800"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="0px 0px 8px 8px"
        borderTopColor="transparent"
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
