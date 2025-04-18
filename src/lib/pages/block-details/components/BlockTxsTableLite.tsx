import { EmptyState } from "lib/components/state";
import { TableTitle, TransactionsTable } from "lib/components/table";
import { useBlockDataRest } from "lib/services/block";

interface BlockTxsTableProps {
  height: number;
}

export const BlockTxsTableLite = ({ height }: BlockTxsTableProps) => {
  const { data, isLoading } = useBlockDataRest(height);
  const total = data?.transactions.length;

  return (
    <>
      <TableTitle count={total} title="Transactions" />
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
        showSuccess={false}
        showTimestamp={false}
        transactions={data?.transactions}
      />
    </>
  );
};
