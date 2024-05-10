import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableTitle, TransactionsTable } from "lib/components/table";
import { useTxsByBlockHeight } from "lib/services/tx";

const scrollComponentId = "block_tx_table_header";

interface BlockTxsTableProps {
  height: number;
}

export const BlockTxsTable = ({ height }: BlockTxsTableProps) => {
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
      <TableTitle title="Transactions" count={data?.total} />
      <TransactionsTable
        transactions={data?.items}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="There are no submitted transactions in this block"
            withBorder
          />
        }
        showRelations={false}
        showTimestamp={false}
      />
      {data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={data.total}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
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
