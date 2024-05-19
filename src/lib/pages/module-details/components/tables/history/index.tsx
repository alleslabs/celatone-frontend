import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ViewMore } from "lib/components/table";
import { useModuleHistoriesByPagination } from "lib/services/move/moduleService";
import type { Option } from "lib/types";

import { PublishedEventsTable } from "./PublishedEventsTable";

interface ModuleHistoryTableProps {
  moduleId: string;
  historyCount: Option<number>;
  scrollComponentId?: string;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const ModuleHistoryTable = ({
  moduleId,
  historyCount,
  scrollComponentId,
  refetchCount,
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
  } = useModuleHistoriesByPagination({
    moduleId,
    offset,
    pageSize: onViewMore ? 5 : pageSize,
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
      <PublishedEventsTable
        moduleHistories={moduleHistories}
        isLoading={isLoading}
        emptyState={
          !moduleId || error ? (
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
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                scrollComponentId={scrollComponentId}
              />
            ))}
    </>
  );
};
