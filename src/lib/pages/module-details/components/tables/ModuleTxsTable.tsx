import type { HexAddr, Option } from "lib/types";

import { useCelatoneApp } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTable, ViewMore } from "lib/components/table";
import { useModuleTxs } from "lib/services/move/module";
import { useEffect } from "react";

interface ModuleTxsTableProps {
  moduleName: string;
  onViewMore?: () => void;
  scrollComponentId?: string;
  txCount: Option<number>;
  vmAddress: HexAddr;
}

export const ModuleTxsTable = ({
  moduleName,
  onViewMore,
  scrollComponentId,
  txCount,
  vmAddress,
}: ModuleTxsTableProps) => {
  const { currentChainId } = useCelatoneApp();

  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: onViewMore ? 5 : 10,
    },
    total: txCount,
  });

  const {
    data: moduleTxs,
    error,
    isLoading,
  } = useModuleTxs(vmAddress, moduleName, pageSize, offset);

  useEffect(() => {
    if (!onViewMore) setPageSize(10);
    setCurrentPage(1);
  }, [currentChainId, onViewMore, setCurrentPage, setPageSize]);

  return (
    <>
      <TransactionsTable
        emptyState={
          error ? (
            <ErrorFetching dataName="transactions" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="There are no transactions on this module."
              withBorder
            />
          )
        }
        isLoading={isLoading}
        showAction={false}
        showRelations={false}
        transactions={moduleTxs?.items}
      />
      {!!txCount &&
        (onViewMore
          ? txCount > 5 && <ViewMore onClick={onViewMore} />
          : txCount > 10 && (
              <Pagination
                currentPage={currentPage}
                offset={offset}
                pageSize={pageSize}
                pagesQuantity={pagesQuantity}
                scrollComponentId={scrollComponentId}
                totalData={txCount}
                onPageChange={setCurrentPage}
                onPageSizeChange={(e) => {
                  const size = Number(e.target.value);
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            ))}
    </>
  );
};
