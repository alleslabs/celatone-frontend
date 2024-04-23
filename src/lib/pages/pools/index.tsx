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
import { usePoolConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { usePoolListCountQuery } from "lib/services/poolService";
import { PoolType } from "lib/types";

import { SupportedSection } from "./components/supportedSection";
import { UnsupportedSection } from "./components/unsupportedSection";

enum TabIndex {
  Supported = "supported",
  Unsupported = "unsupported",
}

export const PoolIndex = () => {
  usePoolConfig({ shouldRedirect: true });
  const router = useRouter();
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
    <>
      <PageHeaderContainer bgColor="overlay.pool">
        <Flex justifyContent="space-between" alignItems="center" zIndex={1}>
          <Flex direction="column">
            <Heading variant="h5" as="h5" minH="36px">
              Osmosis Pools
            </Heading>
            <Text variant="body2" color="text.dark" fontWeight="500">
              This page displays liquidity pools on this network sorted by
              recency
            </Text>
          </Flex>
          <UserDocsLink href="osmosis/pool-list" isButton />
        </Flex>
      </PageHeaderContainer>
      <PageContainer>
        <Tabs index={Object.values(TabIndex).indexOf(tabIndex)}>
          <TabList mb={8} borderBottom="1px" borderColor="gray.800">
            <CustomTab
              count={supportedPoolCount ?? 0}
              onClick={() => handleTabChange(TabIndex.Supported)}
              isLoading={isLoadingSupported}
              isDisabled={!supportedPoolCount}
            >
              Pools
            </CustomTab>
            <CustomTab
              count={unsupportedPoolCount ?? 0}
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
    </>
  );
};
