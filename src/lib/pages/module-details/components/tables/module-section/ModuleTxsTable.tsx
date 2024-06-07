import { useEffect } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTable, ViewMore } from "lib/components/table";
import { useModuleTxs } from "lib/services/move/module";
import type { HexAddr, Option } from "lib/types";

interface ModuleTxsTableProps {
  vmAddress: HexAddr;
  moduleName: string;
  txCount: Option<number>;
  onViewMore?: () => void;
  scrollComponentId?: string;
}

export const ModuleTxsTable = ({
  vmAddress,
  moduleName,
  txCount,
  onViewMore,
  scrollComponentId,
}: ModuleTxsTableProps) => {
  const { currentChainId } = useCelatoneApp();

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
    setTotalData,
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
  } = useModuleTxs(vmAddress, moduleName, pageSize, offset, {
    onSuccess: ({ total }) => setTotalData(total),
  });

  useEffect(() => {
    if (!onViewMore) setPageSize(10);
    setCurrentPage(1);
  }, [currentChainId, onViewMore, setCurrentPage, setPageSize]);

  return (
    <>
      <TransactionsTable
        transactions={moduleTxs?.items}
        isLoading={isLoading}
        emptyState={
          error ? (
            <ErrorFetching dataName="transactions" />
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
                onPageChange={setCurrentPage}
                onPageSizeChange={(e) => {
                  const size = Number(e.target.value);
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                scrollComponentId={scrollComponentId}
              />
            ))}
    </>
  );
};
