import {
  Flex,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import {
  MigrationTable,
  RelatedProposalsTable,
  TxsTable,
} from "../contract-details/components/tables";
import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { useContractDetailsTableCounts } from "lib/model/contract";
import { useAccountId } from "lib/services/accountService";
import { AmpTrackUseTab } from "lib/services/amplitude";
import type { IndexedModule } from "lib/services/moduleService";
import { useAccountModules } from "lib/services/moduleService";
import type { ContractAddr, MoveAccountAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { ModuleFunction } from "./components/ModuleFunction";
import { ModuleInfo } from "./components/ModuleInfo";
import { ModuleTop } from "./components/ModuleTop";
import { QuickAccess } from "./components/QuickAccess";

const tableHeaderId = "moduleDetailsTab";
export enum TabIndex {
  Overview = "overview",
  Function = "function",
  Txs = "txs",
  Structs = "structs",
}
// TODO get module path
const txTableHeaderId = "ModuleTxsTableHeader";

export const ModuleDetails = () => {
  const navigate = useInternalNavigate();
  const router = useRouter();
  const tab = getFirstQueryParam(router.query.tab) as TabIndex;
  const moduleName = getFirstQueryParam(router.query.moduleName);
  const addr = getFirstQueryParam(router.query.address);
  const { data, isLoading } = useAccountModules({
    address: addr as MoveAccountAddr,
    moduleName,
  });

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      AmpTrackUseTab(nextTab);
      navigate({
        pathname: "/modules/[address]/[moduleName]/[tab]",
        query: {
          address: addr,
          moduleName,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [addr, moduleName, tab, navigate]
  );

  useEffect(() => {
    if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
      navigate({
        replace: true,
        pathname: "/modules/[address]/[moduleName]/[tab]",
        query: {
          address: addr,
          moduleName,
          tab: TabIndex.Overview,
        },
        options: {
          shallow: true,
        },
      });
    }
  }, [router.isReady, tab, addr, moduleName, navigate]);
  const contractAddress = "" as ContractAddr;
  const { data: contractAccountId } = useAccountId(contractAddress);

  const {
    tableCounts,
    refetchMigration,
    refetchTransactions,
    refetchRelatedProposals,
  } = useContractDetailsTableCounts(contractAddress);

  if (isLoading && !data) return <Loading />;
  const moduleData = data as IndexedModule;
  // moduleData.parsedAbi.exposed_functions
  // moduleData.viewFunctions
  // moduleData.executeFunctions
  return (
    <PageContainer>
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
            count={moduleData.parsedAbi.exposed_functions.length}
            onClick={handleTabChange(TabIndex.Function)}
            isDisabled={!moduleData.parsedAbi.exposed_functions.length}
          >
            Function
          </CustomTab>
          <CustomTab count={12} onClick={handleTabChange(TabIndex.Txs)}>
            Transactions
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
              <QuickAccess
                viewFnCount={moduleData.viewFunctions.length}
                executeFnCount={moduleData.executeFunctions.length}
              />
              <ModuleInfo isVerified moduleData={moduleData} />
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
            <ModuleFunction moduleData={moduleData} />
          </TabPanel>
          <TabPanel p={0}>
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
          </TabPanel>
          <TabPanel p={0}>4</TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};
