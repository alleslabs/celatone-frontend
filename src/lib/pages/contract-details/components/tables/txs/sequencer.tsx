import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { useTxsByAddressSequencer } from "lib/services/tx";

import type { TxsTableProps } from "./types";

export const TxsTableSequencer = ({ contractAddress }: TxsTableProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useTxsByAddressSequencer(contractAddress, undefined, 10);

  return (
    <>
      <TransactionsTable
        emptyState={
          error ? (
            <ErrorFetching dataName="transactions" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="This contract does not have any transactions."
              withBorder
            />
          )
        }
        isLoading={isLoading}
        showRelations={false}
        transactions={data}
      />
      {hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more 10 transactions"
        />
      )}
    </>
  );
};
