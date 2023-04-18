import { Heading, Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";

import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { usePoolListCountByIsSupported } from "lib/services/poolService";

import { SupportedSection } from "./components/supportedSection";
import { UnsupportedSection } from "./components/unsupportedSection";

export const PoolIndex = () => {
  const { data: supportedPoolCount } = usePoolListCountByIsSupported(
    true,
    "all",
    false,
    ""
  );
  const { data: unsupportedPoolCount } = usePoolListCountByIsSupported(
    false,
    "all",
    false,
    ""
  );

  const sectionHeaderId = "poolListTab";

  return (
    <PageContainer>
      <Heading variant="h5" as="h5">
        Osmosis Pools
      </Heading>
      <Tabs>
        <TabList my={8} borderBottom="1px" borderColor="pebble.800">
          <CustomTab count={supportedPoolCount ?? 0}>Pools</CustomTab>
          <CustomTab count={unsupportedPoolCount ?? 0}>
            Pools with unsupported tokens
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <SupportedSection scrollComponentId={sectionHeaderId} />
          </TabPanel>
          <TabPanel p={0}>
            <UnsupportedSection scrollComponentId={sectionHeaderId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};
