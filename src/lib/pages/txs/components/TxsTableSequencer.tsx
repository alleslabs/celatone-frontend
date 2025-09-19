import { useEvmConfig } from "lib/app-provider";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { EvmTransactionsTable, TransactionsTable } from "lib/components/table";
import { useCosmosEvmTxs, useTxsSequencer } from "lib/services/tx";
import { useMemo } from "react";

import type { TxsTableProps } from "./type";

import { EvmCosmosTabs } from "./type";

interface TxsTableSequencerProps extends TxsTableProps {
  showEvmOrCosmos?: EvmCosmosTabs;
}

export const TxsTableSequencer = ({
  isViewMore,
  showEvmOrCosmos = EvmCosmosTabs.Evm,
}: TxsTableSequencerProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useTxsSequencer(isViewMore ? 5 : 10);

  const txHashes = useMemo(() => data?.map((tx) => tx.hash) ?? [], [data]);
  const { data: evmTxsData, isLoading: isEvmTxsFetcing } =
    useCosmosEvmTxs(txHashes);

  return (
    <>
      {evm.enabled && showEvmOrCosmos === EvmCosmosTabs.Evm ? (
        <EvmTransactionsTable
          emptyState={null}
          evmTransactions={evmTxsData}
          isLoading={isEvmTxsFetcing}
          showTimestamp
        />
      ) : (
        <TransactionsTable
          emptyState={
            error ? (
              <ErrorFetching dataName="transactions" />
            ) : (
              <EmptyState
                imageVariant="empty"
                message="There are no transactions on this network."
                withBorder
              />
            )
          }
          isLoading={isLoading}
          showAction={false}
          showRelations={false}
          transactions={data}
        />
      )}
      {!isViewMore && hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more 10 transactions"
        />
      )}
    </>
  );
};
