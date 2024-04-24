import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { isUndefined } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import {
  useAccountModules,
  useModuleDetailsQuery,
  useModuleHistoriesCount,
  useModuleId,
  useVerifyModule,
} from "lib/services/move/moduleService";
import type { IndexedModule } from "lib/services/move/moduleService";
import { useRelatedProposalsCountByModuleId } from "lib/services/proposalService";
import { useModuleTxsCount } from "lib/services/txService";
import type { Addr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import {
  FunctionTypeTabs,
  ModuleActions,
  ModuleFunctions,
  ModuleInfo,
  ModuleStructs,
  ModuleTables,
  ModuleTablesTabIndex,
  ModuleTop,
} from "./components";
import { TabIndex } from "./types";

const mainTabHeaderId = "main-table-header";

interface ModuleDetailsBodyProps {
  moduleData: IndexedModule;
}

const InvalidModule = () => <InvalidState title="Module does not exist" />;

export const ModuleDetailsBody = ({ moduleData }: ModuleDetailsBodyProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  const { data: moduleId } = useModuleId(
    moduleData.moduleName,
    moduleData.address
  );

  const { data: moduleDetails, isLoading: moduleDetailsLoading } =
    useModuleDetailsQuery(moduleId);

  const { data: verificationData, isLoading: verificationLoading } =
    useVerifyModule({
      address: moduleData.address,
      moduleName: moduleData.moduleName,
    });

  const { data: moduleTxsCount, refetch: refetchTxsCount } =
    useModuleTxsCount(moduleId);
  const { data: moduleHistoriesCount, refetch: refetchHistoriesCount } =
    useModuleHistoriesCount(moduleId);
  const {
    data: moduleRelatedProposalsCount,
    refetch: refetchRelatedProposalsCount,
  } = useRelatedProposalsCountByModuleId(moduleId);
  const refetchCount = () => {
    refetchTxsCount();
    refetchHistoriesCount();
    refetchRelatedProposalsCount();
  };

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
          address: moduleData.address,
          moduleName: moduleData.moduleName,
          tab: nextTab,
          ...(fnType && { type: fnType }),
        },
        options: {
          shallow: true,
        },
      });
    },
    [moduleData.address, moduleData.moduleName, navigate, tab]
  );

  useEffect(() => {
    if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
      navigate({
        replace: true,
        pathname: "/modules/[address]/[moduleName]/[tab]",
        query: {
          address: moduleData.address,
          moduleName: moduleData.moduleName,
          tab: TabIndex.Overview,
        },
        options: {
          shallow: true,
        },
      });
    }
  }, [
    router.isReady,
    tab,
    navigate,
    moduleData.address,
    moduleData.moduleName,
  ]);

  useEffect(() => {
    if (router.isReady && tab && !verificationLoading)
      track(AmpEvent.TO_MODULE_DETAILS, {
        tab,
        isVerified: Boolean(verificationData),
      });
  }, [router.isReady, tab, verificationLoading, verificationData]);

  useEffect(() => {
    if (moduleTxsCount === 0) {
      setOverviewTabIndex(ModuleTablesTabIndex.PublishedEvents);
      setTableTabIndex(ModuleTablesTabIndex.PublishedEvents);
    }
  }, [moduleTxsCount]);

  return (
    <>
      <PageHeaderContainer bgColor="overlay.module">
        <ModuleTop
          isVerified={Boolean(verificationData)}
          moduleData={moduleData}
        />
      </PageHeaderContainer>
      <PageContainer hasPaddingTop={false}>
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
                    !isUndefined(moduleTxsCount) &&
                    !isUndefined(moduleHistoriesCount)
                      ? moduleTxsCount + moduleHistoriesCount
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
                <ModuleInfo
                  upgradePolicy={moduleData.upgradePolicy}
                  moduleDetails={moduleDetails}
                  verificationData={verificationData}
                  isLoading={moduleDetailsLoading}
                />
                <ModuleTables
                  address={moduleData.address}
                  moduleName={moduleData.moduleName}
                  moduleId={moduleId}
                  txsCount={moduleTxsCount}
                  historiesCount={moduleHistoriesCount}
                  refetchCount={refetchCount}
                  relatedProposalsCount={moduleRelatedProposalsCount}
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
                address={moduleData.address}
                moduleName={moduleData.moduleName}
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
                address={moduleData.address}
                moduleName={moduleData.moduleName}
                moduleId={moduleId}
                txsCount={moduleTxsCount}
                historiesCount={moduleHistoriesCount}
                refetchCount={refetchCount}
                relatedProposalsCount={moduleRelatedProposalsCount}
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
      </PageContainer>
    </>
  );
};

export const ModuleDetails = () => {
  const router = useRouter();

  const addr = getFirstQueryParam(router.query.address);
  const moduleName = getFirstQueryParam(router.query.moduleName);

  const { data, isLoading } = useAccountModules({
    address: addr as Addr,
    moduleName,
  });

  if (!router.isReady || isLoading) return <Loading />;
  return (
    <>
      {data === undefined ? (
        <PageContainer>
          <InvalidModule />
        </PageContainer>
      ) : (
        <ModuleDetailsBody moduleData={data as IndexedModule} />
      )}
    </>
  );
};
