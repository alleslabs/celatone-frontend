import { Flex, Tabs, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { AmpTrackUseTab } from "lib/services/amplitude";
import { getFirstQueryParam } from "lib/utils";

import { ModuleInfo } from "./components/ModuleInfo";
import { ModuleTop } from "./components/ModuleTop";
import { QuickAccess } from "./components/QuickAccess";

interface ModuleDetailsProps {
  modulePath: string;
}

const tableHeaderId = "moduleDetailsTab";
export enum TabIndex {
  Overview = "overview",
  Function = "function",
  Txs = "txs",
  Structs = "structs",
}
export const ModuleDetails = ({
  modulePath = "moduletest",
}: ModuleDetailsProps) => {
  const navigate = useInternalNavigate();
  const router = useRouter();
  const tab = getFirstQueryParam(router.query.tab) as TabIndex;

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      AmpTrackUseTab(nextTab);
      navigate({
        pathname: "/modules/[modulePath]/[tab]",
        query: {
          modulePath,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [modulePath, tab, navigate]
  );

  useEffect(() => {
    if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
      navigate({
        replace: true,
        pathname: "/modules/[modulePath]/[tab]",
        query: {
          modulePath,
          tab: TabIndex.Overview,
        },
        options: {
          shallow: true,
        },
      });
    }
  }, [router.isReady, tab, modulePath, navigate]);

  return (
    <PageContainer>
      <ModuleTop isVerified />
      <Tabs
        index={Object.values(TabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          my={8}
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX="scroll"
          id={tableHeaderId}
        >
          <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
            Overview
          </CustomTab>
          <CustomTab count={12} onClick={handleTabChange(TabIndex.Function)}>
            Function
          </CustomTab>
          <CustomTab count={12} onClick={handleTabChange(TabIndex.Txs)}>
            Transactions
          </CustomTab>
          <CustomTab count={12} onClick={handleTabChange(TabIndex.Structs)}>
            Structs
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Flex gap={6} flexDirection="column">
              <QuickAccess />
              <ModuleInfo isVerified contractAddress={undefined} />
            </Flex>
          </TabPanel>
          <TabPanel p={0}>2</TabPanel>
          <TabPanel p={0}>3</TabPanel>
          <TabPanel p={0}>4</TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};
