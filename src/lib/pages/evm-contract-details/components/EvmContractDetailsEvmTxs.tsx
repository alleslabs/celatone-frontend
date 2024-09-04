import { Spinner, Text } from "@chakra-ui/react";

import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { EvmTransactionsTable, ViewMore } from "lib/components/table";
import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { Option, Transaction } from "lib/types";

interface EvmContractDetailsEvmTxsProps {
  onViewMore?: () => void;
  evmTxsData: Option<TxDataWithTimeStampJsonRpc[]>;
  isEvmTxsDataLoading: boolean;
  txsData: Option<Transaction[]>;
  hasNextPage: Option<boolean>;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isTxsFetching: boolean;
  isEvmTxsDataFetching: boolean;
}

export const EvmContractDetailsEvmTxs = ({
  onViewMore,
  evmTxsData,
  isEvmTxsDataLoading,
  txsData,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isTxsFetching,
  isEvmTxsDataFetching,
}: EvmContractDetailsEvmTxsProps) => (
  <>
    <EvmTransactionsTable
      evmTransactions={!onViewMore ? evmTxsData : evmTxsData?.slice(0, 5)}
      isLoading={isEvmTxsDataLoading}
      emptyState={
        <EmptyState
          imageVariant="empty"
          message="There are no EVM transactions on this contract."
        />
      }
      showTimestamp
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
              <ViewMore onClick={onViewMore} />
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
  </>
);
