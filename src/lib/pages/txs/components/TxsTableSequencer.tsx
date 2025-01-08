import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { useTxsSequencer } from "lib/services/tx";

import type { TxsTableProps } from "./type";

export const TxsTableSequencer = ({ isViewMore }: TxsTableProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useTxsSequencer(isViewMore ? 5 : 10);

  return (
    <>
      <TransactionsTable
        transactions={data}
        isLoading={isLoading}
        emptyState={
          error ? (
            <ErrorFetching dataName="transactions" />
          ) : (
            <EmptyState
              withBorder
              imageVariant="empty"
              message="There are no transactions on this network."
            />
          )
        }
        showAction={false}
        showRelations={false}
      />
      {!isViewMore && hasNextPage && (
        <LoadNext
          text="Load more 10 transactions"
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </>
  );
};
