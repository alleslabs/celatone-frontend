import type { ChangeEvent } from "react";

import { NoTransactions } from "../NoTransactions";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableContainer } from "lib/components/table";
import {
  ProposalsTableHeader,
  ProposalsTableRow,
} from "lib/components/table/proposals";
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

  const { data: relatedProposals } =
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

  const templateColumns =
    "100px minmax(300px, 1fr) 150px 330px 180px 160px 160px";

  if (!relatedProposals?.length)
    return (
      <NoTransactions displayText="This contract does not have related proposals yet." />
    );

  return (
    <>
      <TableContainer>
        <ProposalsTableHeader templateColumns={templateColumns} />
        {relatedProposals.map((proposal) => (
          <ProposalsTableRow
            key={proposal.proposalId}
            proposal={proposal}
            templateColumns={templateColumns}
          />
        ))}
      </TableContainer>
      {totalData && totalData > 10 && (
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
