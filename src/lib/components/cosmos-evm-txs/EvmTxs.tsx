import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import type {
  EvmInternalTxsResponseSequencer,
  EvmTxsResponseSequencerWithRpcData,
} from "lib/services/types";
import type { ReactNode } from "react";

import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";

import { CustomTab } from "../CustomTab";
import { LoadNext } from "../LoadNext";
import { EmptyState } from "../state";
import { EvmTransactionsTable, ViewMore } from "../table";
import { EvmInternalTransactionsTable } from "../table/evm-internal-transactions";

export interface EvmTxsProps {
  emptyMessage?: ReactNode;
  evmInternalTxsData?: UseInfiniteQueryResult<
    InfiniteData<EvmInternalTxsResponseSequencer>
  >;
  evmTxsData: UseInfiniteQueryResult<
    InfiniteData<EvmTxsResponseSequencerWithRpcData>
  >;
  onViewMore?: () => void;
  showTimestamp?: boolean;
}

export const EvmTxs = ({
  emptyMessage,
  evmInternalTxsData,
  evmTxsData,
  onViewMore,
  showTimestamp = false,
}: EvmTxsProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const countTotalEvmTxs =
    evmTxsData.data?.pages?.[0]?.pagination?.total ?? undefined;
  const countTotalEvmInternalTxs =
    evmInternalTxsData?.data?.pages?.[0]?.pagination?.total ?? undefined;

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
        <CustomTab count={countTotalEvmTxs}>Transactions</CustomTab>
        {evmInternalTxsData && (
          <CustomTab count={countTotalEvmInternalTxs}>Internal txs</CustomTab>
        )}
      </TabList>
      <TabPanels>
        <TabPanel p={0} pt={{ base: 0, md: 6 }}>
          <EvmTransactionsTable
            emptyState={
              typeof emptyMessage === "string" ? (
                <EmptyState
                  imageVariant="empty"
                  message={emptyMessage || "There are no EVM transactions."}
                />
              ) : (
                (emptyMessage ?? (
                  <EmptyState
                    imageVariant="empty"
                    message="There are no EVM transactions."
                  />
                ))
              )
            }
            evmTransactions={
              evmTxsData.data?.pages?.flatMap((page) => page.txs) ?? []
            }
            isLoading={
              evmTxsData.isLoading ||
              (evmTxsData.isFetching && !evmTxsData.isFetchingNextPage)
            }
            showTimestamp={showTimestamp}
          />
          {evmTxsData.hasNextPage && (
            <>
              {onViewMore ? (
                <ViewMore onClick={onViewMore} />
              ) : (
                <LoadNext
                  fetchNextPage={evmTxsData.fetchNextPage}
                  isFetchingNextPage={evmTxsData.isFetchingNextPage}
                  text="Load more transactions"
                />
              )}
            </>
          )}
        </TabPanel>
        {evmInternalTxsData && (
          <TabPanel p={0} pt={{ base: 0, md: 6 }}>
            <EvmInternalTransactionsTable
              disableInfiniteLoad={!!onViewMore}
              emptyState={
                typeof emptyMessage === "string" ? (
                  <EmptyState
                    imageVariant="empty"
                    message={
                      emptyMessage || "There are no internal transactions."
                    }
                  />
                ) : (
                  (emptyMessage ?? (
                    <EmptyState
                      imageVariant="empty"
                      message="There are no internal transactions."
                    />
                  ))
                )
              }
              fetchNextPage={evmInternalTxsData.fetchNextPage}
              internalTxs={
                evmInternalTxsData.data?.pages?.flatMap(
                  (page) => page.internalTxs
                ) ?? []
              }
              isFetchingNextPage={evmInternalTxsData.isFetchingNextPage}
              isLoading={
                evmInternalTxsData.isLoading ||
                (evmInternalTxsData.isFetching &&
                  !evmInternalTxsData.isFetchingNextPage)
              }
              totalCount={countTotalEvmInternalTxs ?? 0}
            />
            {onViewMore && evmInternalTxsData.hasNextPage && (
              <ViewMore onClick={onViewMore} />
            )}
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};
