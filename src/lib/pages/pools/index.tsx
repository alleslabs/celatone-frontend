import { Heading, Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import PageContainer from "lib/components/PageContainer";
import { usePoolListCountQuery } from "lib/services/poolService";
import { PoolType } from "lib/types";

import { SupportedSection } from "./components/supportedSection";
import { UnsupportedSection } from "./components/unsupportedSection";

enum TabIndex {
  Supported,
  Unsupported,
}

export const PoolIndex = () => {
  const { track } = useTrack();
  const router = useRouter();
  const { trackUseTab } = useTrack();
  const [tabIndex, setTabIndex] = useState(TabIndex.Supported);

  const { data: supportedPoolCount, isLoading: isLoadingSupported } =
    usePoolListCountQuery({
      isSupported: true,
      poolType: PoolType.ALL,
      isSuperfluidOnly: false,
      search: "",
    });
  const { data: unsupportedPoolCount, isLoading: isLoadingUnsupported } =
    usePoolListCountQuery({
      isSupported: false,
      poolType: PoolType.ALL,
      isSuperfluidOnly: false,
      search: "",
    });

  const handleTabChange = useCallback(
    (tab: TabIndex) => {
      trackUseTab(TabIndex[tab]);
      setTabIndex(tab);
    },
    [trackUseTab]
  );

  const sectionHeaderId = "poolListTab";

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_POOL_LIST);
  }, [router.isReady, track]);

  useEffect(() => {
    if (
      supportedPoolCount !== undefined &&
      unsupportedPoolCount !== undefined
    ) {
      if (supportedPoolCount === 0 && unsupportedPoolCount > 0)
        handleTabChange(TabIndex.Unsupported);
      else handleTabChange(TabIndex.Supported);
    }
  }, [handleTabChange, supportedPoolCount, unsupportedPoolCount]);

  if (isLoadingSupported || isLoadingUnsupported) return <LoadingOverlay />;
  return (
    <PageContainer>
      <Heading variant="h5" as="h5">
        Osmosis Pools
      </Heading>
      <Tabs index={tabIndex}>
        <TabList my={8} borderBottom="1px" borderColor="gray.800">
          <CustomTab
            count={supportedPoolCount ?? 0}
            onClick={() => handleTabChange(TabIndex.Supported)}
          >
            Pools
          </CustomTab>
          <CustomTab
            count={unsupportedPoolCount ?? 0}
            onClick={() => handleTabChange(TabIndex.Unsupported)}
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
