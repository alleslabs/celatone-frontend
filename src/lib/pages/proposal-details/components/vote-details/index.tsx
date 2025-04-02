import type {
  Option,
  ProposalData,
  ProposalParams,
  ProposalVotesInfo,
} from "lib/types";

import {
  Accordion,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { ProposalStatus } from "lib/types";
import { isNull } from "lodash";

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
      defaultIndex={[subtabIndex]}
      variant="transparent"
      w="full"
      onChange={(expandedIndex: number) => {
        if (expandedIndex === -1) return;
        trackPeriodSubtab(expandedIndex);
      }}
    >
      <VoteDetailsAccordionItem proposalData={proposalData} step={1}>
        <DepositPeriodSection proposalData={proposalData} {...props} />
      </VoteDetailsAccordionItem>
      <VoteDetailsAccordionItem
        isDisabled={isDepositOnly}
        proposalData={proposalData}
        step={2}
      >
        <VotingPeriod proposalData={proposalData} {...props} />
      </VoteDetailsAccordionItem>
    </Accordion>
  ) : (
    <Tabs
      defaultIndex={subtabIndex}
      isLazy
      lazyBehavior="keepMounted"
      mt={6}
      w="full"
      onChange={(index) => trackPeriodSubtab(index)}
    >
      <TabList borderBottom="0px solid" gap={2}>
        <VoteDetailsTab proposalData={proposalData} step={1} />
        <VoteDetailsTab
          isDisabled={isDepositOnly}
          proposalData={proposalData}
          step={2}
        />
      </TabList>
      <TabPanels
        background="gray.800"
        borderColor="gray.700"
        borderRadius="0px 0px 8px 8px"
        borderStyle="solid"
        borderTopColor="transparent"
        borderWidth="1px"
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
