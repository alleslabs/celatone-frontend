import type { BechAddr32, Option } from "lib/types";
import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { useRelatedProposalsByContractAddress } from "lib/services/proposal";

interface RelatedProposalsTableProps {
  contractAddress: BechAddr32;
  refetchCount: () => void;
  scrollComponentId: string;
  totalData: Option<number>;
}

export const RelatedProposalsTable = ({
  contractAddress,
  refetchCount,
  scrollComponentId,
  totalData,
}: RelatedProposalsTableProps) => {
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
      pageSize: 10,
    },
    total: totalData,
  });

  const {
    data: relatedProposals,
    error,
    isLoading,
  } = useRelatedProposalsByContractAddress(contractAddress, offset, pageSize);

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
      {!!totalData && totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          scrollComponentId={scrollComponentId}
          totalData={totalData}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};
