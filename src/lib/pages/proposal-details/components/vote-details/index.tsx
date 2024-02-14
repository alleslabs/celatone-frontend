import {
  Accordion,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import type { ProposalData } from "lib/types";

import { DepositPeriodSection } from "./deposit-period/DepositPeriodSection";
import { VoteDetailsAccordionItem } from "./VoteDetailsAccordionItem";
import { VoteDetailsTab } from "./VoteDetailsTab";
import { VotingPeriod } from "./voting-period";

interface VoteDetailsProps {
  proposalData: ProposalData;
}

export const VoteDetails = ({ proposalData }: VoteDetailsProps) => {
  const isMobile = useMobile();

  return isMobile ? (
    <Flex>
      <Accordion allowToggle w="full" defaultIndex={[0]} variant="transparent">
        <VoteDetailsAccordionItem step={1} proposalData={proposalData}>
          <DepositPeriodSection />
        </VoteDetailsAccordionItem>
        <VoteDetailsAccordionItem step={2} proposalData={proposalData}>
          <VotingPeriod id={proposalData.id} />
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
            <VotingPeriod id={proposalData.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
