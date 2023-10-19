import {
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { MouseEventHandler } from "react";
import { useState, useCallback, useEffect } from "react";

import { useTrack } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import {
  type IndexedModule,
  useVerifyModule,
  useModuleId,
  useAccountModules,
  useModuleHistoriesCount,
  useModuleDetailsQuery,
} from "lib/services/move/moduleService";
import { useModuleTxsCount } from "lib/services/txService";
import type { MoveAccountAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { FunctionTypeTabs } from "./components/FunctionTypeSwitch";
import { ModuleFunction } from "./components/ModuleFunction";
import { ModuleInfo } from "./components/ModuleInfo";
import { ModuleStruct } from "./components/ModuleStruct";
import { ModuleTop } from "./components/ModuleTop";
import { ModuleTxsTable, ModuleHistoryTable } from "./components/tables";

const mainTabHeaderId = "main-table-header";
const overviewHistoryHeaderId = "overview-history-header";
const historyTabHeaderId = "history-tab-header";

export enum TabIndex {
  Overview = "overview",
  Function = "function",
  History = "history",
  Structs = "structs",
}

interface ActionInfo {
  icon: IconKeys;
  iconColor: string;
  name: string;
  count: number | string;
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled: boolean;
}

interface ModuleDetailsBodyProps {
  moduleData: IndexedModule;
}

const InvalidModule = () => <InvalidState title="Module does not exist" />;

export const ModuleDetailsBody = ({ moduleData }: ModuleDetailsBodyProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { trackUseTab } = useTrack();

  const tab = getFirstQueryParam(router.query.tab) as TabIndex;
  const [overviewHistoryTabIndex, setOverviewHistoryTabIndex] = useState(0);
  const [historyTabIndex, setHistoryTabIndex] = useState(0);

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
    [moduleData.address, moduleData.moduleName, navigate, tab, trackUseTab]
  );

  const { data: moduleId } = useModuleId(
    moduleData.moduleName,
    moduleData.address
  );

  const { data: moduleDetails, isLoading: moduleDetailsLoading } =
    useModuleDetailsQuery(moduleId);

  const { data: verificationData } = useVerifyModule({
    address: moduleData.address,
    moduleName: moduleData.moduleName,
  });

  const { data: moduleTxsCount, refetch: refetchTxsCount } =
    useModuleTxsCount(moduleId);
  const { data: moduleHistoriesCount, refetch: refetchHistoriesCount } =
    useModuleHistoriesCount(moduleId);

  const actionList: ActionInfo[] = [
    {
      icon: "query" as IconKeys,
      iconColor: "primary.main",
      name: "View Functions",
      count: moduleData.viewFunctions.length,
      onClick: handleTabChange(TabIndex.Function, FunctionTypeTabs.VIEW),
      disabled: moduleData.viewFunctions.length === 0,
    },
    {
      icon: "execute" as IconKeys,
      iconColor: "accent.main",
      name: "Execute Functions",
      count: moduleData.executeFunctions.length,
      onClick: handleTabChange(TabIndex.Function, FunctionTypeTabs.EXECUTE),
      disabled: moduleData.executeFunctions.length === 0,
    },
    {
      icon: "list" as IconKeys,
      iconColor: "gray.600",
      name: "Transactions",
      count: Number(moduleTxsCount) + Number(moduleHistoriesCount) || "N/A",
      onClick: handleTabChange(TabIndex.History),
      disabled: Number(moduleTxsCount) + Number(moduleHistoriesCount) === 0,
    },
  ];

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
    if (Number(moduleTxsCount) === 0) {
      setOverviewHistoryTabIndex(1);
      setHistoryTabIndex(1);
    }
  }, [moduleTxsCount]);

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
            Function
          </CustomTab>
          <CustomTab onClick={handleTabChange(TabIndex.History)}>
            History
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
              <Flex
                justifyContent="space-between"
                direction={{ base: "column", md: "row" }}
                gap={{ base: 2, md: 6 }}
                mb={{ base: 2, md: 6 }}
              >
                {actionList.map((item) => (
                  <Flex
                    key={item.name}
                    p={4}
                    transition="all .25s ease-in-out"
                    borderRadius={8}
                    w="full"
                    alignItems="center"
                    justifyContent="space-between"
                    {...(item.disabled
                      ? {
                          bg: "gray.900",
                          cursor: "not-allowed",
                        }
                      : {
                          bg: "gray.800",
                          _hover: { bg: "gray.700" },
                          cursor: "pointer",
                          onClick: item.onClick,
                        })}
                  >
                    <Flex gap={3} alignItems="center">
                      <CustomIcon
                        name={item.icon}
                        boxSize={6}
                        color={item.iconColor}
                      />
                      <Flex flexDirection="column">
                        <Text
                          variant="body1"
                          color="text.dark"
                          fontWeight={600}
                        >
                          {item.name}
                        </Text>
                        <Heading as="h6" variant="h6" fontWeight={600}>
                          {item.count}
                        </Heading>
                      </Flex>
                    </Flex>
                    <CustomIcon name="chevron-right" color="gray.600" />
                  </Flex>
                ))}
              </Flex>
              <ModuleInfo
                upgradePolicy={moduleData.upgradePolicy}
                moduleDetails={moduleDetails}
                verificationData={verificationData}
                isLoading={moduleDetailsLoading}
              />
              <Flex flexDirection="column" mt={6}>
                <Heading
                  as="h6"
                  variant="h6"
                  mb={6}
                  fontWeight={600}
                  id={overviewHistoryHeaderId}
                >
                  History
                </Heading>
                <Tabs
                  isLazy
                  lazyBehavior="keepMounted"
                  index={overviewHistoryTabIndex}
                  onChange={setOverviewHistoryTabIndex}
                >
                  <TabList
                    borderBottom="1px solid"
                    borderColor="gray.700"
                    overflowX={{ base: "scroll", md: "auto" }}
                  >
                    <CustomTab
                      count={moduleTxsCount}
                      isDisabled={Number(moduleTxsCount) === 0}
                    >
                      Transactions
                    </CustomTab>
                    <CustomTab count={moduleHistoriesCount}>
                      Published Events
                    </CustomTab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0}>
                      <ModuleTxsTable
                        moduleId={moduleId}
                        txCount={moduleTxsCount}
                        refetchCount={refetchTxsCount}
                        onViewMore={() => {
                          handleTabChange(TabIndex.History)();
                          setHistoryTabIndex(0);
                        }}
                      />
                    </TabPanel>
                    <TabPanel p={0}>
                      <ModuleHistoryTable
                        moduleId={moduleId}
                        historyCount={moduleHistoriesCount}
                        refetchCount={refetchHistoriesCount}
                        onViewMore={() => {
                          handleTabChange(TabIndex.History)();
                          setHistoryTabIndex(1);
                        }}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            </Flex>
          </TabPanel>
          <TabPanel p={0}>
            <ModuleFunction
              address={moduleData.address}
              moduleName={moduleData.moduleName}
              fns={moduleData.parsedAbi.exposed_functions}
              viewFns={moduleData.viewFunctions}
              executeFns={moduleData.executeFunctions}
            />
          </TabPanel>
          <TabPanel p={0}>
            <Flex flexDirection="column" mt={6}>
              <Heading
                as="h6"
                variant="h6"
                mb={6}
                fontWeight={600}
                id={historyTabHeaderId}
              >
                History
              </Heading>
              <Tabs
                isLazy
                lazyBehavior="keepMounted"
                index={historyTabIndex}
                onChange={setHistoryTabIndex}
              >
                <TabList
                  borderBottom="1px solid"
                  borderColor="gray.700"
                  overflowX={{ base: "scroll", md: "auto" }}
                >
                  <CustomTab
                    count={moduleTxsCount}
                    isDisabled={Number(moduleTxsCount) === 0}
                  >
                    Transactions
                  </CustomTab>
                  <CustomTab count={moduleHistoriesCount}>
                    Published Events
                  </CustomTab>
                </TabList>
                <TabPanels>
                  <TabPanel p={0}>
                    <ModuleTxsTable
                      moduleId={moduleId}
                      txCount={moduleTxsCount}
                      refetchCount={refetchTxsCount}
                      scrollComponentId={historyTabHeaderId}
                    />
                  </TabPanel>
                  <TabPanel p={0}>
                    <ModuleHistoryTable
                      moduleId={moduleId}
                      historyCount={moduleHistoriesCount}
                      refetchCount={refetchHistoriesCount}
                      scrollComponentId={historyTabHeaderId}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
          </TabPanel>
          <TabPanel p={0}>
            <ModuleStruct structs={moduleData.parsedAbi.structs} />
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

  const { data, isLoading } = useAccountModules({
    address: addr as MoveAccountAddr,
    moduleName,
  });

  if (!router.isReady || isLoading) return <Loading />;
  return (
    <PageContainer>
      {data === undefined ? (
        <InvalidModule />
      ) : (
        <ModuleDetailsBody moduleData={data as IndexedModule} />
      )}
    </PageContainer>
  );
};
