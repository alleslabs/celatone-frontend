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
import { useCallback, useEffect } from "react";

import {
  MigrationTable,
  RelatedProposalsTable,
  TxsTable,
} from "../contract-details/components/tables";
import { useTrack } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useContractDetailsTableCounts } from "lib/model/contract";
import { useAccountId } from "lib/services/accountService";
import type { IndexedModule } from "lib/services/moduleService";
import { useAccountModules } from "lib/services/moduleService";
import type { ContractAddr, MoveAccountAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { FunctionTypeTabs } from "./components/FunctionTypeSwitch";
import { ModuleFunction } from "./components/ModuleFunction";
import { ModuleInfo } from "./components/ModuleInfo";
import { ModuleStruct } from "./components/ModuleStruct";
import { ModuleTop } from "./components/ModuleTop";

const tableHeaderId = "moduleDetailsTab";
export enum TabIndex {
  Overview = "overview",
  Function = "function",
  Txs = "txs",
  Structs = "structs",
}

interface ActionInfo {
  icon: IconKeys;
  iconColor: string;
  name: string;
  count: number;
  onClick: MouseEventHandler<HTMLDivElement>;
}

// TODO get module path
const txTableHeaderId = "ModuleTxsTableHeader";

interface ModuleDetailsBodyProps {
  moduleData: IndexedModule;
}

const InvalidModule = () => <InvalidState title="Module does not exist" />;

export const ModuleDetailsBody = ({ moduleData }: ModuleDetailsBodyProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { trackUseTab } = useTrack();

  const tab = getFirstQueryParam(router.query.tab) as TabIndex;

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
          ...(fnType ? { type: fnType } : {}),
        },
        options: {
          shallow: true,
        },
      });
    },
    [moduleData.address, moduleData.moduleName, navigate, tab, trackUseTab]
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

  const contractAddress = "" as ContractAddr;
  const { data: contractAccountId } = useAccountId(contractAddress);
  const {
    tableCounts,
    refetchMigration,
    refetchTransactions,
    refetchRelatedProposals,
  } = useContractDetailsTableCounts(contractAddress, contractAccountId);

  const actionList: ActionInfo[] = [
    {
      icon: "query" as IconKeys,
      iconColor: "primary.main",
      name: "View Functions",
      count: moduleData?.viewFunctions.length,
      onClick: handleTabChange(TabIndex.Function, FunctionTypeTabs.VIEW),
    },
    {
      icon: "execute" as IconKeys,
      iconColor: "accent.main",
      name: "Execute Functions",
      count: moduleData?.executeFunctions.length,
      onClick: handleTabChange(TabIndex.Function, FunctionTypeTabs.EXECUTE),
    },
    {
      // TO DO get tx count
      icon: "list" as IconKeys,
      iconColor: "gray.600",
      name: "Transactions",
      count: 0,
      onClick: handleTabChange(TabIndex.Txs),
    },
  ];
  return (
    <>
      <ModuleTop isVerified moduleData={moduleData} />
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
          <CustomTab
            count={moduleData?.parsedAbi.exposed_functions.length}
            onClick={handleTabChange(TabIndex.Function, FunctionTypeTabs.ALL)}
            isDisabled={!moduleData?.parsedAbi.exposed_functions.length}
          >
            Function
          </CustomTab>
          <CustomTab count={12} onClick={handleTabChange(TabIndex.Txs)}>
            Transactions
          </CustomTab>
          <CustomTab
            count={moduleData?.parsedAbi.structs.length}
            onClick={handleTabChange(TabIndex.Structs)}
            isDisabled={!moduleData?.parsedAbi.structs.length}
          >
            Structs
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Flex gap={6} flexDirection="column">
              <Flex justifyContent="space-between" gap={6} mb={6}>
                {actionList.map((item) => (
                  <Flex
                    p={4}
                    bg="gray.800"
                    _hover={{ bg: "gray.700" }}
                    transition="all .25s ease-in-out"
                    borderRadius={8}
                    w="full"
                    alignItems="center"
                    justifyContent="space-between"
                    cursor="pointer"
                    onClick={item.onClick}
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
              <ModuleInfo moduleData={moduleData} />
              {/* TODO History */}
              <Flex flexDirection="column" mt={6}>
                <Heading
                  as="h6"
                  variant="h6"
                  mb={6}
                  fontWeight={600}
                  id={tableHeaderId}
                >
                  History
                </Heading>
                <Tabs isLazy lazyBehavior="keepMounted">
                  <TabList
                    borderBottom="1px solid"
                    borderColor="gray.700"
                    overflowX={{ base: "scroll", md: "auto" }}
                  >
                    <CustomTab count={tableCounts.transactionsCount}>
                      Transactions
                    </CustomTab>
                    <CustomTab count={tableCounts.migrationCount}>
                      Migrations
                    </CustomTab>
                    <CustomTab
                      count={tableCounts.relatedProposalsCount}
                      whiteSpace="nowrap"
                    >
                      Related Proposals
                    </CustomTab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0}>
                      <TxsTable
                        contractAccountId={contractAccountId}
                        scrollComponentId={txTableHeaderId}
                        totalData={tableCounts.transactionsCount}
                        refetchCount={refetchTransactions}
                      />
                    </TabPanel>
                    <TabPanel p={0}>
                      <MigrationTable
                        contractAddress={contractAddress}
                        scrollComponentId={txTableHeaderId}
                        totalData={tableCounts.migrationCount}
                        refetchCount={refetchMigration}
                      />
                    </TabPanel>
                    <TabPanel p={0}>
                      <RelatedProposalsTable
                        contractAddress={contractAddress}
                        scrollComponentId={txTableHeaderId}
                        totalData={tableCounts.relatedProposalsCount}
                        refetchCount={refetchRelatedProposals}
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
          {/* TODO TX History */}
          <TabPanel p={0}>
            <Flex flexDirection="column" mt={6}>
              <Heading
                as="h6"
                variant="h6"
                mb={6}
                fontWeight={600}
                id={tableHeaderId}
              >
                History
              </Heading>
              <Tabs isLazy lazyBehavior="keepMounted">
                <TabList
                  borderBottom="1px solid"
                  borderColor="gray.700"
                  overflowX={{ base: "scroll", md: "auto" }}
                >
                  <CustomTab count={tableCounts.transactionsCount}>
                    Transactions
                  </CustomTab>
                  <CustomTab count={tableCounts.migrationCount}>
                    Migrations
                  </CustomTab>
                  <CustomTab
                    count={tableCounts.relatedProposalsCount}
                    whiteSpace="nowrap"
                  >
                    Related Proposals
                  </CustomTab>
                </TabList>
                <TabPanels>
                  <TabPanel p={0}>
                    <TxsTable
                      contractAccountId={contractAccountId}
                      scrollComponentId={txTableHeaderId}
                      totalData={tableCounts.transactionsCount}
                      refetchCount={refetchTransactions}
                    />
                  </TabPanel>
                  <TabPanel p={0}>
                    <MigrationTable
                      contractAddress={contractAddress}
                      scrollComponentId={txTableHeaderId}
                      totalData={tableCounts.migrationCount}
                      refetchCount={refetchMigration}
                    />
                  </TabPanel>
                  <TabPanel p={0}>
                    <RelatedProposalsTable
                      contractAddress={contractAddress}
                      scrollComponentId={txTableHeaderId}
                      totalData={tableCounts.relatedProposalsCount}
                      refetchCount={refetchRelatedProposals}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
          </TabPanel>
          <TabPanel p={0}>
            <ModuleStruct moduleData={moduleData} />
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
