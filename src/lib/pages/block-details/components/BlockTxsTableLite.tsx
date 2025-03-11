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
      <TableTitle title="Transactions" count={total} />
      <TransactionsTable
        transactions={data?.transactions}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="There are no submitted transactions in this block"
            withBorder
          />
        }
        showSuccess={false}
        showRelations={false}
        showTimestamp={false}
      />
    </>
  );
};
