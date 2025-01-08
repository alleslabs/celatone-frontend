import { useEffect } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ViewMore } from "lib/components/table";
import { useModuleHistories } from "lib/services/move/module";
import type { HexAddr, Option } from "lib/types";

import { PublishedEventsTable } from "./PublishedEventsTable";

interface ModuleHistoryTableProps {
  vmAddress: HexAddr;
  moduleName: string;
  historyCount: Option<number>;
  scrollComponentId?: string;
  onViewMore?: () => void;
}

export const ModuleHistoryTable = ({
  vmAddress,
  moduleName,
  historyCount,
  scrollComponentId,
  onViewMore,
}: ModuleHistoryTableProps) => {
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
    total: historyCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const {
    data: moduleHistories,
    isLoading,
    error,
  } = useModuleHistories(
    vmAddress,
    moduleName,
    onViewMore ? 5 : pageSize,
    offset,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  useEffect(() => {
    if (!onViewMore) setPageSize(10);
    setCurrentPage(1);
  }, [currentChainId, onViewMore, setCurrentPage, setPageSize]);

  return (
    <>
      <PublishedEventsTable
        moduleHistories={moduleHistories?.items}
        isLoading={isLoading}
        emptyState={
          error ? (
            <ErrorFetching dataName="module published events history" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="This module does not have any published events yet."
              withBorder
            />
          )
        }
      />
      {!!historyCount &&
        (onViewMore
          ? historyCount > 5 && <ViewMore onClick={onViewMore} />
          : historyCount > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={historyCount}
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
