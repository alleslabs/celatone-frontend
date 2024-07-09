import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { TableTitle, TransactionsTable } from "lib/components/table";
import { useTxsByBlockHeightSequencer } from "lib/services/tx";

interface BlockTxsTableProps {
  height: number;
}

export const BlockTxsTableSequencer = ({ height }: BlockTxsTableProps) => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useTxsByBlockHeightSequencer(height);

  return (
    <>
      <TableTitle title="Transactions" showCount={false} />
      <TransactionsTable
        transactions={data}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="There are no submitted transactions in this block"
            withBorder
          />
        }
        showSuccess
        showRelations={false}
        showTimestamp={false}
      />
      {hasNextPage && (
        <LoadNext
          text="Load more 10 blocks"
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </>
  );
};
