import {
  Heading,
  Spinner,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

import { useContractDetailsEvmTxs } from "../data";
import { TxsTabIndex } from "../types";
import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import {
  EvmTransactionsTable,
  TransactionsTable,
  ViewMore,
} from "lib/components/table";
import { useTxsByAddressSequencer } from "lib/services/tx";
import type { BechAddr20 } from "lib/types";

interface EvmContractDetailsTxsProps {
  address: BechAddr20;
  onViewMore?: () => void;
}

export const EvmContractDetailsTxs = ({
  address,
  onViewMore,
}: EvmContractDetailsTxsProps) => {
  const [tab, setTab] = useState<TxsTabIndex>(TxsTabIndex.Cosmos);

  const {
    data: txsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isTxsLoading,
    isFetching: isTxsFetching,
    isFetchingNextPage,
    latestFetchedData,
  } = useTxsByAddressSequencer(address, undefined);

  const {
    data: evmTxsData,
    isLoading: isEvmTxsDataLoading,
    isFetching: isEvmTxsDataFetching,
  } = useContractDetailsEvmTxs(latestFetchedData);

  const handleTabChange = useCallback(
    (nextTab: TxsTabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      setTab(nextTab);
    },
    [tab, setTab]
  );

  return (
    <Stack gap={6}>
      <Heading as="h6" variant="h6">
        Transactions
      </Heading>
      <Tabs index={Object.values(TxsTabIndex).indexOf(tab)}>
        <TabList>
          <CustomTab onClick={handleTabChange(TxsTabIndex.Cosmos)}>
            Cosmos
          </CustomTab>
          <CustomTab onClick={handleTabChange(TxsTabIndex.Evm)}>EVM</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={6}>
            <TransactionsTable
              transactions={!onViewMore ? txsData : txsData?.slice(0, 5)}
              isLoading={isTxsLoading}
              emptyState={
                <EmptyState
                  imageVariant="empty"
                  message="There are no transactions on this contract."
                />
              }
              showRelations={false}
            />
            {!onViewMore && (
              <Text variant="body2" color="text.dark" mt={2}>
                {txsData?.length ?? 0} Cosmos transactions found
              </Text>
            )}
            {hasNextPage && (
              <>
                {onViewMore ? (
                  <ViewMore
                    onClick={() => {
                      onViewMore();
                      handleTabChange(TxsTabIndex.Cosmos);
                    }}
                  />
                ) : (
                  <LoadNext
                    text="Load more 10 transactions"
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                  />
                )}
              </>
            )}
          </TabPanel>
          <TabPanel p={0} pt={6}>
            <EvmTransactionsTable
              evmTransactions={
                !onViewMore ? evmTxsData : evmTxsData.slice(0, 5)
              }
              isLoading={isEvmTxsDataLoading}
              emptyState={
                <EmptyState
                  imageVariant="empty"
                  message="There are no EVM transactions on this contract."
                />
              }
            />
            {evmTxsData && (
              <>
                {!onViewMore && (
                  <Text variant="body2" color="text.dark" mt={2}>
                    {isTxsFetching || isEvmTxsDataFetching ? (
                      <Spinner as="span" size="xs" mr={1} />
                    ) : (
                      evmTxsData.length
                    )}{" "}
                    EVM Txs found from {txsData?.length ?? 0} Cosmos Txs
                  </Text>
                )}
                {hasNextPage && (
                  <>
                    {onViewMore ? (
                      <ViewMore
                        onClick={() => {
                          onViewMore();
                          handleTabChange(TxsTabIndex.Evm);
                        }}
                      />
                    ) : (
                      <LoadNext
                        text="Load more transactions"
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
