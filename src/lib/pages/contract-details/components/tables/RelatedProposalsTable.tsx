import type { BechAddr32, Option } from "lib/types";
import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { useRelatedProposalsByContractAddress } from "lib/services/proposal";

interface RelatedProposalsTableProps {
  contractAddress: BechAddr32;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
}

export const RelatedProposalsTable = ({
  contractAddress,
  scrollComponentId,
  totalData,
  refetchCount,
}: RelatedProposalsTableProps) => {
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: totalData,
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
