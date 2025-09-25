import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import type { Pagination, TransactionWithTxResponse } from "lib/types";
import type { ReactNode } from "react";

import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";

import { CustomTab } from "../CustomTab";
import { LoadNext } from "../LoadNext";
import { EmptyState } from "../state";
import { TransactionsTable, ViewMore } from "../table";

export interface CosmosTxsProps {
  data: UseInfiniteQueryResult<
    InfiniteData<{
      items: TransactionWithTxResponse[];
      pagination: Pagination;
    }>
  >;
  emptyMessage?: ReactNode;
  onViewMore?: () => void;
}

export const CosmosTxs = ({
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
}: CosmosTxsProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const countTotal = data?.pages?.[0]?.pagination?.total ?? undefined;

  return (
    <Tabs>
      {evm.enabled && (
        <TabList>
          <CustomTab count={countTotal}>Transactions</CustomTab>
        </TabList>
      )}
      <TabPanels>
        <TabPanel p={0} pt={{ base: 0, md: evm.enabled ? 6 : 0 }}>
          <TransactionsTable
            emptyState={
              typeof emptyMessage === "string" ? (
                <EmptyState
                  imageVariant="empty"
                  message={
                    emptyMessage ??
                    "There are no transactions, or they have been pruned from the REST."
                  }
                />
              ) : (
                emptyMessage
              )
            }
            isLoading={isLoading || (isFetching && !isFetchingNextPage)}
            showRelations={false}
            showTimestamp={false}
            transactions={data?.pages.flatMap((page) => page.items) ?? []}
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
      </TabPanels>
    </Tabs>
  );
};
