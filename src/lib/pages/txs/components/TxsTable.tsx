import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { useTxs } from "lib/services/txService";

interface TxsTableProps {
  isViewMore: boolean;
}

export const TxsTable = ({ isViewMore }: TxsTableProps) => {
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
      pageSize: isViewMore ? 5 : 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data, isLoading, error } = useTxs(pageSize, offset, {
    onSuccess: ({ total }) => setTotalData(total),
  });

  return (
    <>
      <TransactionsTable
        transactions={data?.items}
        isLoading={isLoading}
        emptyState={
          error ? (
            <EmptyState
              withBorder
              imageVariant="not-found"
              message="There is an error during fetching transactions."
            />
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
      {!isViewMore && data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={data.total}
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
