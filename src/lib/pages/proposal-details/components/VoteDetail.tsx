import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import { VoteDetailTab } from "./VoteDetailTab";

export const VoteDetail = () => {
  return (
    <Flex>
      {/* To add index to Tabs */}
      <Tabs isLazy lazyBehavior="keepMounted" w="full">
        <TabList borderBottom="0px solid" gap={2}>
          <VoteDetailTab
            step={1}
            title="Deposit Period"
            description=" Deposit ends in 4 days 21:00:11"
          />
          <VoteDetailTab
            step={2}
            title="Voting Period"
            description=" Deposit ends in 4 days 21:00:11"
          />
        </TabList>
        <TabPanels
          background="gray.800"
          p={6}
          border="1px solid"
          borderColor="gray.700"
          borderTopColor="transparent"
          borderRadius="0px 0px 8px 8px"
        >
          <TabPanel>1</TabPanel>
          <TabPanel>2</TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
