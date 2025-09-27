import { EmptyState } from "lib/components/state";
import { TableTitle, TransactionsTable } from "lib/components/table";
import { useTxsByBlockHeightSequencer } from "lib/services/tx";

interface BlockTxsTableProps {
  height: number;
}

export const BlockTxsTableSequencer = ({ height }: BlockTxsTableProps) => {
  const { data, isLoading } = useTxsByBlockHeightSequencer(height);
  const countTotal = data?.pages[0].pagination.total ?? undefined;
  return (
    <>
      <TableTitle count={countTotal} title="Transactions" />
      <TransactionsTable
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="There are no submitted transactions in this block"
            withBorder
          />
        }
        isLoading={isLoading}
        showRelations={false}
        showSuccess
        showTimestamp={false}
        transactions={data?.pages.flatMap((page) => page.items) || []}
      />
    </>
  );
};
