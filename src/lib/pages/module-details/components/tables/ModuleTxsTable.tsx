import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable, ViewMore } from "lib/components/table";
import { useModuleTxsByPagination } from "lib/services/txService";
import type { Nullable, Option } from "lib/types";

interface ModuleTxsTableProps {
  moduleId: Option<Nullable<number>>;
  txCount: Option<number>;
  onViewMore?: () => void;
  scrollComponentId?: string;
  refetchCount: () => void;
}

export const ModuleTxsTable = ({
  moduleId,
  txCount,
  onViewMore,
  scrollComponentId,
  refetchCount,
}: ModuleTxsTableProps) => {
  const { currentChainId } = useCelatoneApp();

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: txCount,
    initialState: {
      pageSize: onViewMore ? 5 : 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const {
    data: moduleTxs,
    isLoading,
    error,
  } = useModuleTxsByPagination({
    moduleId,
    pageSize,
    offset,
  });

  const onPageChange = (nextPage: number) => {
    refetchCount();
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetchCount();
    setPageSize(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!onViewMore) setPageSize(10);
    setCurrentPage(1);
  }, [currentChainId, onViewMore, setCurrentPage, setPageSize]);

  return (
    <>
      <TransactionsTable
        transactions={moduleTxs}
        isLoading={isLoading}
        emptyState={
          !moduleId || error ? (
            <EmptyState
              withBorder
              imageVariant="not-found"
              message="There is an error during fetching transactions."
            />
          ) : (
            <EmptyState
              withBorder
              imageVariant="empty"
              message="There are no transactions on this module."
            />
          )
        }
        showAction={false}
        showRelations={false}
      />
      {!!txCount &&
        (onViewMore
          ? txCount > 5 && <ViewMore onClick={onViewMore} />
          : txCount > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={txCount}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                scrollComponentId={scrollComponentId}
              />
            ))}
    </>
  );
};
