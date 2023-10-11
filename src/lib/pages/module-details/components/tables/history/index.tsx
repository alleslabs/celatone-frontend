import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { useCelatoneApp, useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableContainer, ViewMore } from "lib/components/table";
import { useModuleHistoriesByPagination } from "lib/services/moduleService";
import type { Nullable, Option } from "lib/types";

import { ModuleHistoryHeader } from "./ModuleHistoryHeader";
import { ModuleHistoryRow } from "./ModuleHistoryRow";

const TEMPLATE_COLUMNS = "180px minmax(300px, 1fr) 140px 260px";

interface ModuleTxsTableProps {
  moduleId: Option<Nullable<number>>;
  historyCount: Option<number>;
  scrollComponentId?: string;
  onViewMore?: () => void;
  refetchCount: () => void;
}

export const ModuleHistoryTable = ({
  moduleId,
  historyCount,
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
    total: historyCount,
    initialState: {
      pageSize: onViewMore ? 5 : 10,
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
    pageSize: pageSize + 1,
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

  const isMobile = useMobile();

  useEffect(() => {
    if (!onViewMore) setPageSize(10);
    setCurrentPage(1);
  }, [currentChainId, onViewMore, setCurrentPage, setPageSize]);

  if (!moduleId || error)
    return (
      <EmptyState
        withBorder
        imageVariant="not-found"
        message="There is an error fetching module published events history."
      />
    );
  if (isLoading)
    return isMobile ? (
      <>
        <Loading />
        {historyCount && (
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
        )}
      </>
    ) : (
      <Loading withBorder />
    );

  if (!moduleHistories?.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="This module does not have any published events yet."
        withBorder
      />
    );

  // TODO: Mobile card version

  return (
    <>
      <TableContainer>
        <ModuleHistoryHeader templateColumns={TEMPLATE_COLUMNS} />
        {moduleHistories.slice(0, pageSize).map((history) => (
          <ModuleHistoryRow
            key={JSON.stringify(history)}
            templateColumns={TEMPLATE_COLUMNS}
            history={history}
          />
        ))}
      </TableContainer>
      {onViewMore && Number(historyCount) > 5 && (
        <ViewMore onClick={onViewMore} />
      )}
      {!onViewMore && historyCount !== undefined && historyCount > 10 && (
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
      )}
    </>
  );
};
