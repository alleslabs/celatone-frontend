import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable, ViewMore } from "lib/components/table";
import { useModuleRelatedProposals } from "lib/services/move";
import type { HexAddr, Option } from "lib/types";

interface ModuleRelatedProposalsTableProps {
  address: HexAddr;
  moduleName: string;
  scrollComponentId: string;
  relatedProposalsCount: Option<number>;
  onViewMore?: () => void;
}

export const ModuleRelatedProposalsTable = ({
  address,
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
    address,
    moduleName,
    offset,
    onViewMore ? 5 : pageSize,
    {
      onSuccess: (data) => {
        setTotalData(data.total);
      },
    }
  );

  return (
    <>
      <ProposalsTable
        proposals={relatedProposals?.items}
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
