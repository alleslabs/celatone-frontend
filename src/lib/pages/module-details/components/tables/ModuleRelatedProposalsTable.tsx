import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable, ViewMore } from "lib/components/table";
import { useRelatedProposalsByModuleIdPagination } from "lib/services/proposalService";
import type { Option } from "lib/types";

interface ModuleRelatedProposalsTableProps {
  moduleId: string;
  scrollComponentId: string;
  relatedProposalsCount: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const ModuleRelatedProposalsTable = ({
  moduleId,
  scrollComponentId,
  relatedProposalsCount,
  refetchCount,
  onViewMore,
}: ModuleRelatedProposalsTableProps) => {
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: relatedProposalsCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const {
    data: relatedProposals,
    isLoading,
    error,
  } = useRelatedProposalsByModuleIdPagination(
    moduleId,
    offset,
    onViewMore ? 5 : pageSize
  );

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

  return (
    <>
      <ProposalsTable
        proposals={relatedProposals}
        isLoading={isLoading}
        emptyState={
          error ? (
            <ErrorFetching dataName="related proposals" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="This contract does not have related proposals yet."
            />
          )
        }
      />
      {!!relatedProposalsCount &&
        (onViewMore
          ? relatedProposalsCount > 5 && <ViewMore onClick={onViewMore} />
          : relatedProposalsCount > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={relatedProposalsCount}
                scrollComponentId={scrollComponentId}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            ))}
    </>
  );
};
