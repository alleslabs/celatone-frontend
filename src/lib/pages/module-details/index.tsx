import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { isNull } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type {
  ModuleInfoResponse,
  ModuleTableCountsResponse,
} from "lib/services/move/module";
import {
  indexModuleResponse,
  useModuleInfo,
  useModuleTableCounts,
  useVerifyModule,
} from "lib/services/move/moduleService";
import type { HexAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import {
  FunctionTypeTabs,
  ModuleActions,
  ModuleFunctions,
  ModuleStructs,
  ModuleTables,
  ModuleTablesTabIndex,
  ModuleTop,
} from "./components";
import { TabIndex } from "./types";

const mainTabHeaderId = "main-table-header";

interface ModuleDetailsBodyProps {
  moduleInfo: ModuleInfoResponse;
  moduleTableCounts: ModuleTableCountsResponse;
}

const InvalidModule = () => <InvalidState title="Module does not exist" />;

export const ModuleDetailsBody = ({
  moduleInfo,
  moduleTableCounts,
}: ModuleDetailsBodyProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  const moduleData = indexModuleResponse(moduleInfo);

  const { data: verificationData, isLoading: verificationLoading } =
    useVerifyModule({
      address: moduleInfo.address,
      moduleName: moduleInfo.moduleName,
    });

  const tab = getFirstQueryParam(router.query.tab) as TabIndex;
  const [overviewTabIndex, setOverviewTabIndex] = useState(
    ModuleTablesTabIndex.Transactions
  );
  const [tableTabIndex, setTableTabIndex] = useState(
    ModuleTablesTabIndex.Transactions
  );

  const handleTabChange = useCallback(
    (nextTab: TabIndex, fnType?: FunctionTypeTabs) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/modules/[address]/[moduleName]/[tab]",
        query: {
          address: moduleInfo.address,
          moduleName: moduleInfo.moduleName,
          tab: nextTab,
          ...(fnType && { type: fnType }),
        },
        options: {
          shallow: true,
        },
      });
    },
    [moduleInfo, navigate, tab]
  );

  useEffect(() => {
    if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
      navigate({
        replace: true,
        pathname: "/modules/[address]/[moduleName]/[tab]",
        query: {
          address: moduleInfo.address,
          moduleName: moduleInfo.moduleName,
          tab: TabIndex.Overview,
        },
        options: {
          shallow: true,
        },
      });
    }
  }, [router.isReady, tab, navigate, moduleInfo]);

  useEffect(() => {
    if (router.isReady && tab && !verificationLoading)
      track(AmpEvent.TO_MODULE_DETAILS, {
        tab,
        isVerified: Boolean(verificationData),
      });
  }, [router.isReady, tab, verificationLoading, verificationData]);

  useEffect(() => {
    if (moduleTableCounts.txs === 0) {
      setOverviewTabIndex(ModuleTablesTabIndex.PublishedEvents);
      setTableTabIndex(ModuleTablesTabIndex.PublishedEvents);
    }
  }, [moduleTableCounts]);

  return (
    <>
      <ModuleTop
        isVerified={Boolean(verificationData)}
        moduleData={moduleData}
      />
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
          id={mainTabHeaderId}
        >
          <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
            Overview
          </CustomTab>
          <CustomTab
            count={moduleData.parsedAbi.exposed_functions.length}
            onClick={handleTabChange(TabIndex.Function, FunctionTypeTabs.ALL)}
            isDisabled={!moduleData.parsedAbi.exposed_functions.length}
          >
            Functions
          </CustomTab>
          <CustomTab onClick={handleTabChange(TabIndex.TxsHistories)}>
            Transactions & Histories
          </CustomTab>
          <CustomTab
            count={moduleData.parsedAbi.structs.length}
            onClick={handleTabChange(TabIndex.Structs)}
            isDisabled={!moduleData.parsedAbi.structs.length}
          >
            Structs
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Flex gap={6} flexDirection="column">
              <ModuleActions
                viewFns={moduleData.viewFunctions.length}
                executeFns={moduleData.executeFunctions.length}
                allTxsCount={
                  !isNull(moduleTableCounts.txs) &&
                  !isNull(moduleTableCounts.histories)
                    ? moduleTableCounts.txs + moduleTableCounts.histories
                    : undefined
                }
                onSelectAction={(
                  nextTab: TabIndex,
                  fnType?: FunctionTypeTabs
                ) => {
                  track(AmpEvent.USE_NAVIGATING_BUTTON, {
                    label: fnType ?? "History",
                  });
                  handleTabChange(nextTab, fnType)();
                }}
              />
              {/* <ModuleInfo
                upgradePolicy={moduleInfo.upgradePolicy}
                moduleDetails={moduleDetails}
                verificationData={verificationData}
                isLoading={moduleDetailsLoading}
              /> */}
              <ModuleTables
                address={moduleInfo.address}
                moduleName={moduleInfo.moduleName}
                txsCount={moduleTableCounts.txs ?? 0}
                historiesCount={moduleTableCounts.histories ?? 0}
                relatedProposalsCount={moduleTableCounts.proposals ?? 0}
                tab={overviewTabIndex}
                setTab={setOverviewTabIndex}
                onViewMore={(nextTab: ModuleTablesTabIndex) => {
                  handleTabChange(TabIndex.TxsHistories)();
                  setTableTabIndex(nextTab);
                }}
              />
            </Flex>
            <UserDocsLink
              title="What is a move module?"
              cta="Read more about Module"
              href="move/modules/detail-page"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleFunctions
              address={moduleInfo.address}
              moduleName={moduleInfo.moduleName}
              fns={moduleData.parsedAbi.exposed_functions}
              viewFns={moduleData.viewFunctions}
              executeFns={moduleData.executeFunctions}
            />
            <UserDocsLink
              title="What is Module functions?"
              cta="Read more about View and Execute Functions"
              href="move/modules/detail-page#functions"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleTables
              address={moduleInfo.address}
              moduleName={moduleInfo.moduleName}
              txsCount={moduleTableCounts.txs ?? 0}
              historiesCount={moduleTableCounts.histories ?? 0}
              relatedProposalsCount={moduleTableCounts.proposals ?? 0}
              tab={tableTabIndex}
              setTab={setTableTabIndex}
            />
            <UserDocsLink
              title="What is Module Transaction?"
              cta="Read more about transaction in module"
              href="move/modules/detail-page#transactions-histories"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleStructs structs={moduleData.parsedAbi.structs} />
            <UserDocsLink
              title="What is Module Struct?"
              cta="Read more about struct in module"
              href="move/modules/detail-page#structs"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export const ModuleDetails = () => {
  const router = useRouter();
  const addr = getFirstQueryParam(router.query.address);
  const moduleName = getFirstQueryParam(router.query.moduleName);

  const { data: moduleInfo, isLoading: isModuleInfoLoading } = useModuleInfo(
    moduleName,
    addr as HexAddr
  );
  const { data: moduleTableCounts, isLoading: isMoudleTableCountsLoading } =
    useModuleTableCounts(moduleName, addr as HexAddr);

  if (!router.isReady || isModuleInfoLoading || isMoudleTableCountsLoading)
    return <Loading />;

  return (
    <PageContainer>
      {!moduleInfo || !moduleTableCounts ? (
        <InvalidModule />
      ) : (
        <ModuleDetailsBody
          moduleInfo={moduleInfo}
          moduleTableCounts={moduleTableCounts}
        />
      )}
    </PageContainer>
  );
};
