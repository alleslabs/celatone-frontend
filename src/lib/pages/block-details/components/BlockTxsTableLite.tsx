import { EmptyState } from "lib/components/state";
import { TableTitle, TransactionsTable } from "lib/components/table";
import { useBlockDataLcd } from "lib/services/block";

interface BlockTxsTableProps {
  height: number;
}

export const BlockTxsTableLite = ({ height }: BlockTxsTableProps) => {
  const { data, isLoading } = useBlockDataLcd(height);
  const total = data?.transactions.length;

  return (
    <>
      <TableTitle title="Transactions" count={total} />
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
