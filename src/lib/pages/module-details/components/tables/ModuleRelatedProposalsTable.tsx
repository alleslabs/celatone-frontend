import type { HexAddr, Option } from "lib/types";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable, ViewMore } from "lib/components/table";
import { useModuleRelatedProposals } from "lib/services/move/module";

interface ModuleRelatedProposalsTableProps {
  vmAddress: HexAddr;
  moduleName: string;
  scrollComponentId: string;
  relatedProposalsCount: Option<number>;
  onViewMore?: () => void;
}

export const ModuleRelatedProposalsTable = ({
  vmAddress,
  moduleName,
  scrollComponentId,
  relatedProposalsCount,
  onViewMore,
}: ModuleRelatedProposalsTableProps) => {
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
    setTotalData,
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
  } = useModuleRelatedProposals(
    vmAddress,
    moduleName,
    onViewMore ? 5 : pageSize,
    offset,
    {
      onSuccess: (data) => setTotalData(data.total),
    }
  );

  return (
    <>
      <ProposalsTable
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
        isLoading={isLoading}
        proposals={relatedProposals?.items}
      />
      {!!relatedProposalsCount &&
        (onViewMore
          ? relatedProposalsCount > 5 && <ViewMore onClick={onViewMore} />
          : relatedProposalsCount > 10 && (
              <Pagination
                currentPage={currentPage}
                offset={offset}
                pageSize={pageSize}
                pagesQuantity={pagesQuantity}
                scrollComponentId={scrollComponentId}
                totalData={relatedProposalsCount}
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
