import {
  Accordion,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
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

export interface VoteDetailsProps {
  proposalData: ProposalData;
  votesInfo: Option<ProposalVotesInfo>;
  params: Option<ProposalParams>;
  isLoading: boolean;
}

export const VoteDetails = ({ proposalData, ...props }: VoteDetailsProps) => {
  const isMobile = useMobile();

  return isMobile ? (
    <Flex>
      <Accordion allowToggle w="full" defaultIndex={[0]} variant="transparent">
        <VoteDetailsAccordionItem step={1} proposalData={proposalData}>
          <DepositPeriodSection />
        </VoteDetailsAccordionItem>
        <VoteDetailsAccordionItem step={2} proposalData={proposalData}>
          <VotingPeriod proposalData={proposalData} {...props} />
        </VoteDetailsAccordionItem>
      </Accordion>
    </Flex>
  ) : (
    <Flex mt={8}>
      {/* To add index to Tabs */}
      <Tabs isLazy lazyBehavior="keepMounted" w="full">
        <TabList borderBottom="0px solid" gap={2}>
          <VoteDetailsTab step={1} proposalData={proposalData} />
          <VoteDetailsTab step={2} proposalData={proposalData} />
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
