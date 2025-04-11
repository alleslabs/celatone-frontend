import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableTitle, TransactionsTable } from "lib/components/table";
import { useTxsByBlockHeight } from "lib/services/tx";

const scrollComponentId = "block_tx_table_header";

interface BlockTxsTableProps {
  height: number;
}

export const BlockTxsTableFull = ({ height }: BlockTxsTableProps) => {
  const {
    pagesQuantity,
    setTotalData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data, isLoading } = useTxsByBlockHeight(height, pageSize, offset, {
    onSuccess: ({ total }) => setTotalData(total),
  });

  return (
    <>
      <TableTitle count={data?.total} title="Transactions" />
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
        transactions={data?.items}
      />
      {data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          scrollComponentId={scrollComponentId}
          totalData={data.total}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
};
