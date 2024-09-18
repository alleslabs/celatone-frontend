import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { isUndefined } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { usePoolConfig, useTierConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { PoolType } from "lib/types";

import { SupportedSection } from "./components/supportedSection";
import { UnsupportedSection } from "./components/unsupportedSection";
import { useDerivedPools } from "./data";

enum TabIndex {
  Supported = "supported",
  Unsupported = "unsupported",
}

export const PoolIndex = () => {
  useTierConfig({ minTier: "full" });
  usePoolConfig({ shouldRedirect: true });
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(TabIndex.Supported);

  const { totalCount: supportedPoolCount, isLoading: isLoadingSupported } =
    useDerivedPools(10, 0, true, PoolType.ALL, false, "", true);
  const { totalCount: unsupportedPoolCount, isLoading: isLoadingUnsupported } =
    useDerivedPools(10, 0, false, PoolType.ALL, false, "", true);

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
      !isUndefined(supportedPoolCount) &&
      !isUndefined(unsupportedPoolCount) &&
      supportedPoolCount === 0 &&
      unsupportedPoolCount > 0
    ) {
      handleTabChange(TabIndex.Unsupported);
    }
  }, [handleTabChange, supportedPoolCount, unsupportedPoolCount]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Pools" />
      <Flex justifyContent="space-between" alignItems="center">
        <Flex direction="column">
          <Heading variant="h5" as="h5" minH="36px">
            Osmosis Pools
          </Heading>
          <Text variant="body2" color="text.dark" fontWeight="500">
            This page displays liquidity pools on this network sorted by recency
          </Text>
        </Flex>
        <UserDocsLink href="osmosis/pool-list" isButton />
      </Flex>
      <Tabs
        index={Object.values(TabIndex).indexOf(tabIndex)}
        lazyBehavior="keepMounted"
        isLazy
      >
        <TabList my={8} borderBottom="1px" borderColor="gray.800">
          <CustomTab
            count={supportedPoolCount}
            onClick={() => handleTabChange(TabIndex.Supported)}
            isLoading={isLoadingSupported}
            isDisabled={!supportedPoolCount}
          >
            Pools
          </CustomTab>
          <CustomTab
            count={unsupportedPoolCount}
            onClick={() => handleTabChange(TabIndex.Unsupported)}
            isLoading={isLoadingUnsupported}
            isDisabled={!unsupportedPoolCount}
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
