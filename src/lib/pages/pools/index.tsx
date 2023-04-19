import { Heading, Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { CustomTab } from "lib/components/CustomTab";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import PageContainer from "lib/components/PageContainer";
import { usePoolListCountByIsSupported } from "lib/services/poolService";

import { SupportedSection } from "./components/supportedSection";
import { UnsupportedSection } from "./components/unsupportedSection";

enum TabIndex {
  Supported,
  Unsupported,
}

export const PoolIndex = () => {
  const [tabIndex, setTabIndex] = useState(TabIndex.Supported);

  const { data: supportedPoolCount, isLoading: isLoadingSupported } =
    usePoolListCountByIsSupported(true, "all", false, "");
  const { data: unsupportedPoolCount, isLoading: isLoadingUnsupported } =
    usePoolListCountByIsSupported(false, "all", false, "");

  const sectionHeaderId = "poolListTab";

  useEffect(() => {
    if (
      supportedPoolCount !== undefined &&
      unsupportedPoolCount !== undefined
    ) {
      if (supportedPoolCount === 0 && unsupportedPoolCount > 0)
        setTabIndex(TabIndex.Unsupported);
      else setTabIndex(TabIndex.Supported);
    }
  }, [supportedPoolCount, unsupportedPoolCount]);

  if (isLoadingSupported || isLoadingUnsupported) return <LoadingOverlay />;
  return (
    <PageContainer>
      <Heading variant="h5" as="h5">
        Osmosis Pools
      </Heading>
      <Tabs index={tabIndex}>
        <TabList my={8} borderBottom="1px" borderColor="pebble.800">
          <CustomTab
            count={supportedPoolCount ?? 0}
            onClick={() => setTabIndex(TabIndex.Supported)}
          >
            Pools
          </CustomTab>
          <CustomTab
            count={unsupportedPoolCount ?? 0}
            onClick={() => setTabIndex(TabIndex.Unsupported)}
          >
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
