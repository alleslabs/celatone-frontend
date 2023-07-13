import { Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { useMobile } from "lib/app-provider";
import { ProposalCard } from "lib/components/card/ProposalCard";
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
  const isMobile = useMobile();
  const emptyState = (
    <EmptyState
      imageVariant="empty"
      message="This contract does not have related proposals yet."
    />
  );
  if (!relatedProposals?.length) return emptyState;
  return (
    <>
      {isMobile ? (
        <Flex direction="column" gap={4} w="full" mt={4}>
          {relatedProposals.map((proposal) => (
            <ProposalCard key={proposal.proposalId} proposal={proposal} />
          ))}
        </Flex>
      ) : (
        <ProposalsTable
          proposals={relatedProposals}
          isLoading={isLoading}
          emptyState={emptyState}
        />
      )}
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
