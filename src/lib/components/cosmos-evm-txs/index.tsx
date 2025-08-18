import type {
  EvmDebugTraceResponse,
  TxDataWithTimeStampJsonRpc,
} from "lib/services/types";
import type { Option, TransactionWithTxResponse } from "lib/types";

import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { CosmosEvmTxsTab, useEvmTab } from "lib/hooks";
import { useEffect, useState } from "react";

import { CustomTab } from "../CustomTab";
import { LoadNext } from "../LoadNext";
import { EmptyState } from "../state";
import { EvmTransactionsTable, TransactionsTable, ViewMore } from "../table";
import { EvmInternalTransactionsTable } from "../table/evm-internal-transactions";
import { TypeSwitch } from "../TypeSwitch";

interface CosmosEvmTxsProps {
  cosmosEmptyMessage?: string;
  cosmosTxs: Option<TransactionWithTxResponse[]>;
  evmEmptyMessage?: string;
  evmTxs: Option<TxDataWithTimeStampJsonRpc[]>;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  internalTxs?: EvmDebugTraceResponse;
  isCosmosTxsLoading: boolean;
  isEvmTxsLoading: boolean;
  isFetchingNextPage?: boolean;
  onViewMore?: () => void;
}

export const CosmosEvmTxs = ({
  cosmosEmptyMessage,
  cosmosTxs,
  evmEmptyMessage,
  evmTxs,
  fetchNextPage,
  hasNextPage,
  internalTxs,
  isCosmosTxsLoading,
  isEvmTxsLoading,
  isFetchingNextPage,
  onViewMore,
}: CosmosEvmTxsProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { currentTab, setCurrentTab, tabs } = useEvmTab();

  useEffect(() => {
    if (currentTab === CosmosEvmTxsTab.Cosmos) {
      setTabIndex(0);
    }
  }, [currentTab]);

  return (
    <Flex direction="column" gap={6}>
      <Flex
        align="center"
        gap={6}
        justify={{
          base: "space-between",
          md: "flex-start",
        }}
      >
        <Heading as="h6" variant="h6">
          Transactions
        </Heading>
        <TypeSwitch
          currentTab={currentTab}
          disabledScrollToTop
          tabs={tabs}
          onTabChange={setCurrentTab}
        />
      </Flex>
      <Tabs
        index={tabIndex}
        isLazy
        lazyBehavior="keepMounted"
        onChange={setTabIndex}
      >
        <TabList
          id="cosmos-evm-txs-tab-list"
          borderBottomWidth="1px"
          borderColor="gray.700"
          overflowX="scroll"
        >
          <CustomTab
            count={
              currentTab === CosmosEvmTxsTab.Evm
                ? evmTxs?.length
                : cosmosTxs?.length
            }
          >
            Transactions
          </CustomTab>
          {currentTab === CosmosEvmTxsTab.Evm && (
            <CustomTab>Internal txs</CustomTab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 0, md: 6 }}>
            {currentTab === CosmosEvmTxsTab.Evm ? (
              <EvmTransactionsTable
                emptyState={
                  <EmptyState
                    imageVariant="empty"
                    message={
                      evmEmptyMessage ?? "There are no EVM transactions."
                    }
                  />
                }
                evmTransactions={evmTxs}
                isLoading={isEvmTxsLoading}
                showTimestamp
              />
            ) : (
              <TransactionsTable
                emptyState={
                  <EmptyState
                    imageVariant="empty"
                    message={
                      cosmosEmptyMessage ??
                      "There are no transactions, or they have been pruned from the REST."
                    }
                  />
                }
                isLoading={isCosmosTxsLoading}
                showRelations={false}
                showSuccess
                showTimestamp={false}
                transactions={cosmosTxs}
              />
            )}
            {hasNextPage && (
              <>
                {onViewMore ? (
                  <ViewMore onClick={onViewMore} />
                ) : (
                  <>
                    {fetchNextPage && isFetchingNextPage && (
                      <LoadNext
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        text="Load more transactions"
                      />
                    )}
                  </>
                )}
              </>
            )}
          </TabPanel>
          <TabPanel p={0} pt={{ base: 0, md: 6 }}>
            <EvmInternalTransactionsTable internalTxs={internalTxs ?? []} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
