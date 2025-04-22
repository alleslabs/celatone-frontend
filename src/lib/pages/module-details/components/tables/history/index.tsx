import type { HexAddr, Option } from "lib/types";

import { useCelatoneApp } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ViewMore } from "lib/components/table";
import { useModuleHistories } from "lib/services/move/module";
import { useEffect } from "react";

import { PublishedEventsTable } from "./PublishedEventsTable";

interface ModuleHistoryTableProps {
  historyCount: Option<number>;
  moduleName: string;
  onViewMore?: () => void;
  scrollComponentId?: string;
  vmAddress: HexAddr;
}

export const ModuleHistoryTable = ({
  historyCount,
  moduleName,
  onViewMore,
  scrollComponentId,
  vmAddress,
}: ModuleHistoryTableProps) => {
  const { currentChainId } = useCelatoneApp();

  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
    total: historyCount,
  });

  const {
    data: moduleHistories,
    error,
    isLoading,
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
        isLoading={isLoading}
        moduleHistories={moduleHistories?.items}
      />
      {!!historyCount &&
        (onViewMore
          ? historyCount > 5 && <ViewMore onClick={onViewMore} />
          : historyCount > 10 && (
              <Pagination
                currentPage={currentPage}
                offset={offset}
                pageSize={pageSize}
                pagesQuantity={pagesQuantity}
                scrollComponentId={scrollComponentId}
                totalData={historyCount}
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
