import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { useRelatedProposalsByContractAddressPagination } from "lib/services/proposalService";
import type { ContractAddr, Option } from "lib/types";

interface RelatedProposalsTableProps {
  contractAddress: ContractAddr;
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

  const { data: relatedProposals, isLoading } =
    useRelatedProposalsByContractAddressPagination(
      contractAddress,
      offset,
      pageSize
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
          <EmptyState
            message="This contract does not have related proposals yet."
            withBorder
          />
        }
      />
      {!!totalData && totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};
