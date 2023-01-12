import { Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { NoTransactions } from "../NoTransactions";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useRelatedProposalsByContractAddress } from "lib/services/contractService";
import type { ContractAddr } from "lib/types";

import { RelatedProposalsHeader } from "./RelatedProposalsHeader";
import { RelatedProposalsRow } from "./RelatedProposalsRow";

interface RelatedProposalsTableProps {
  contractAddress: ContractAddr;
  scrollComponentId: string;
  totalData: number;
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

  const { data: relatedProposals } = useRelatedProposalsByContractAddress(
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
    "100px minmax(300px, 1fr) 150px 330px 180px 140px 160px";

  if (!relatedProposals?.length)
    return (
      <NoTransactions displayText="This contract does not have related proposals yet." />
    );

  return (
    <Flex direction="column" overflowX="scroll">
      <RelatedProposalsHeader templateColumns={templateColumns} />
      {relatedProposals.map((proposal) => (
        <RelatedProposalsRow
          proposal={proposal}
          templateColumns={templateColumns}
        />
      ))}
      {relatedProposals.length > 10 && (
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
    </Flex>
  );
};
