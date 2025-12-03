import { useEvmConfig } from "lib/app-provider";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { EvmTransactionsTable, TransactionsTable } from "lib/components/table";
import { CosmosEvmTxsTab } from "lib/hooks";
import { useEvmTxs } from "lib/services/evm-txs";
import { useTxsSequencer } from "lib/services/tx";

import type { TxsTableProps } from "./type";

interface TxsTableSequencerProps extends TxsTableProps {
  showEvmOrCosmos?: CosmosEvmTxsTab;
}

export const TxsTableSequencer = ({
  isViewMore,
  showEvmOrCosmos = CosmosEvmTxsTab.Evm,
}: TxsTableSequencerProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const cosmosData = useTxsSequencer(isViewMore ? 5 : 10);
  const evmData = useEvmTxs(isViewMore ? 5 : 10);

  if (evm.enabled && showEvmOrCosmos === CosmosEvmTxsTab.Evm) {
    return (
      <>
        <EvmTransactionsTable
          emptyState={
            <EmptyState
              imageVariant="empty"
              message="There are no EVM transactions."
            />
          }
          evmTransactions={
            evmData.data?.pages.flatMap((page) => page.txs) ?? []
          }
          isLoading={
            evmData.isLoading ||
            (evmData.isFetching && !evmData.isFetchingNextPage)
          }
          showTimestamp
        />
        {!isViewMore && evmData.hasNextPage && (
          <LoadNext
            fetchNextPage={evmData.fetchNextPage}
            isFetchingNextPage={evmData.isFetchingNextPage}
            text="Load more transactions"
          />
        )}
      </>
    );
  }

  return (
    <>
      <TransactionsTable
        emptyState={
          cosmosData.error ? (
            <ErrorFetching dataName="transactions" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="There are no transactions on this network."
              withBorder
            />
          )
        }
        isLoading={cosmosData.isLoading}
        showAction={false}
        showRelations={false}
        transactions={
          cosmosData.data?.pages.flatMap((page) => page.items) ?? []
        }
      />
      {!isViewMore && cosmosData.hasNextPage && (
        <LoadNext
          fetchNextPage={cosmosData.fetchNextPage}
          isFetchingNextPage={cosmosData.isFetchingNextPage}
          text="Load more transactions"
        />
      )}
    </>
  );
};
