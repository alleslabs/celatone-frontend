import { Spinner, Text } from "@chakra-ui/react";

import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { EvmTransactionsTable, ViewMore } from "lib/components/table";
import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";

interface EvmContractDetailsEvmTxsProps {
  onViewMore?: () => void;
  evmTxs: Option<TxDataWithTimeStampJsonRpc[]>;
  isEvmTxsLoading: boolean;
  cosmosTxsCount: Option<number>;
  hasNextPage: Option<boolean>;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export const EvmContractDetailsEvmTxs = ({
  onViewMore,
  evmTxs,
  isEvmTxsLoading,
  cosmosTxsCount,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: EvmContractDetailsEvmTxsProps) => (
  <>
    <EvmTransactionsTable
      evmTransactions={!onViewMore ? evmTxs : evmTxs?.slice(0, 5)}
      isLoading={isEvmTxsLoading}
      emptyState={
        evmTxs === undefined ? (
          <ErrorFetching dataName="evm transactions" />
        ) : (
          <EmptyState
            imageVariant="empty"
            message="There are no EVM transactions on this contract."
          />
        )
      }
      showTimestamp
    />
    {evmTxs && (
      <>
        {!onViewMore && (
          <Text variant="body2" color="text.dark" mt={2}>
            {isFetchingNextPage ? (
              <Spinner as="span" size="xs" mr={1} />
            ) : (
              evmTxs.length
            )}{" "}
            EVM Txs found from {cosmosTxsCount ?? 0} Cosmos Txs
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
