import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import type { EvmTxsResponseSequencerWithRpcData } from "lib/services/types";
import type { ReactNode } from "react";

import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";

import { CustomTab } from "../CustomTab";
import { LoadNext } from "../LoadNext";
import { EmptyState } from "../state";
import { EvmTransactionsTable, ViewMore } from "../table";

export interface EvmTxsProps {
  data: UseInfiniteQueryResult<
    InfiniteData<EvmTxsResponseSequencerWithRpcData>
  >;
  emptyMessage?: ReactNode;
  onViewMore?: () => void;
  showTimestamp?: boolean;
}

export const EvmTxs = ({
  data: {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  },
  emptyMessage,
  onViewMore,
  showTimestamp = false,
}: EvmTxsProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const countTotal = data?.pages?.[0]?.pagination?.total ?? undefined;

  return (
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
        <CustomTab count={countTotal}>Transactions</CustomTab>
        <CustomTab>Internal txs</CustomTab>
      </TabList>
      <TabPanels>
        <TabPanel p={0} pt={{ base: 0, md: 6 }}>
          <EvmTransactionsTable
            emptyState={
              typeof emptyMessage === "string" ? (
                <EmptyState
                  imageVariant="empty"
                  message={emptyMessage ?? "There are no EVM transactions."}
                />
              ) : (
                emptyMessage
              )
            }
            evmTransactions={data?.pages.flatMap((page) => page.txs) ?? []}
            isLoading={isLoading || (isFetching && !isFetchingNextPage)}
            showTimestamp={showTimestamp}
          />
          {hasNextPage && (
            <>
              {onViewMore ? (
                <ViewMore onClick={onViewMore} />
              ) : (
                <LoadNext
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  text="Load more transactions"
                />
              )}
            </>
          )}
        </TabPanel>
        <TabPanel p={0} pt={{ base: 0, md: 6 }}>
          {/* <EvmInternalTransactionsTable internalTxs={internalTxs ?? []} /> */}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
