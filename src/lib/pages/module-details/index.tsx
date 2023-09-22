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
import { useTrack } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { useContractDetailsTableCounts } from "lib/model/contract";
import { useAccountId } from "lib/services/accountService";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

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
  const { trackUseTab } = useTrack();

  const tab = getFirstQueryParam(router.query.tab) as TabIndex;
  const modulePath = getFirstQueryParam(router.query.modulePath);
  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
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
    [modulePath, navigate, tab, trackUseTab]
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

  const contractAddress = "" as ContractAddr;
  const { data: contractAccountId } = useAccountId(contractAddress);
  const {
    tableCounts,
    refetchMigration,
    refetchTransactions,
    refetchRelatedProposals,
  } = useContractDetailsTableCounts(contractAddress, contractAccountId);

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
              <ModuleInfo isVerified />
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
          <TabPanel p={0}>2</TabPanel>
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
