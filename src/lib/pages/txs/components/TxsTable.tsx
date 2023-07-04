import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { useTxs, useTxsCount } from "lib/services/txService";

interface TxsTableProps {
  isViewMore: boolean;
}

export const TxsTable = ({ isViewMore }: TxsTableProps) => {
  const { currentChainId } = useCelatoneApp();
  const { data: countTxs = 0 } = useTxsCount();

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: countTxs,
    initialState: {
      pageSize: isViewMore ? 5 : 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data: txs, isLoading, error } = useTxs(offset, pageSize);

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!isViewMore) setPageSize(10);
    setCurrentPage(1);
  }, [currentChainId, isViewMore, setCurrentPage, setPageSize]);
  // TODO - Might consider adding this state in all transaction table
  if (error)
    return (
      <EmptyState
        withBorder
        imageVariant="not-found"
        message="There is an error during fetching transactions."
      />
    );
  return (
    <>
      <TransactionsTable
        transactions={txs}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            withBorder
            imageVariant="empty"
            message="There are no transactions on this network."
          />
        }
        showAction={false}
        showRelations={false}
      />
      {!isViewMore && countTxs > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={countTxs}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};
