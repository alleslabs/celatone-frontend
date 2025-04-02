import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { usePoolConfig, useTierConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { usePools } from "lib/services/pools";
import { PoolType } from "lib/types";
import { isUndefined } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { SupportedSection } from "./components/supportedSection";
import { UnsupportedSection } from "./components/unsupportedSection";

enum TabIndex {
  Supported = "supported",
  Unsupported = "unsupported",
}

export const PoolIndex = () => {
  useTierConfig({ minTier: "full" });
  usePoolConfig({ shouldRedirect: true });
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(TabIndex.Supported);

  const { data: supportedPoolsData, isLoading: isLoadingSupportedPools } =
    usePools(10, 0, true, PoolType.ALL, false, "", true);
  const { data: unsupportedPoolsData, isLoading: isLoadingUnsupportedPools } =
    usePools(10, 0, false, PoolType.ALL, false, "", true);

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => {
      if (nextTab === tabIndex) return;
      trackUseTab(nextTab);
      setTabIndex(nextTab);
    },
    [tabIndex]
  );

  const sectionHeaderId = "poolListTab";

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_POOL_LIST);
  }, [router.isReady]);

  useEffect(() => {
    if (
      !isUndefined(supportedPoolsData?.total) &&
      !isUndefined(unsupportedPoolsData?.total) &&
      supportedPoolsData.total === 0 &&
      unsupportedPoolsData.total > 0
    ) {
      handleTabChange(TabIndex.Unsupported);
    }
  }, [handleTabChange, supportedPoolsData?.total, unsupportedPoolsData?.total]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Pools" />
      <Flex alignItems="center" justifyContent="space-between">
        <Flex direction="column">
          <Heading as="h5" minH="36px" variant="h5">
            Osmosis Pools
          </Heading>
          <Text color="text.dark" fontWeight="500" variant="body2">
            This page displays liquidity pools on this network sorted by recency
          </Text>
        </Flex>
        <UserDocsLink href="osmosis/pool-list" isButton />
      </Flex>
      <Tabs
        index={Object.values(TabIndex).indexOf(tabIndex)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          borderBottomWidth="1px"
          borderColor="gray.800"
          borderStyle="solid"
          my={8}
        >
          <CustomTab
            count={supportedPoolsData?.total}
            isDisabled={!supportedPoolsData}
            isLoading={isLoadingSupportedPools}
            onClick={() => handleTabChange(TabIndex.Supported)}
          >
            Pools
          </CustomTab>
          <CustomTab
            count={unsupportedPoolsData?.total}
            isDisabled={!unsupportedPoolsData}
            isLoading={isLoadingUnsupportedPools}
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
