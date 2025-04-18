import type { BechAddr, Option } from "lib/types";
import type { ChangeEvent } from "react";

import { Box } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ErrorFetching } from "lib/components/state";
import { MobileTitle, ProposalsTable, ViewMore } from "lib/components/table";
import { useProposalsByAddress } from "lib/services/proposal";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import AccountSectionWrapper from "../AccountSectionWrapper";

interface OpenedProposalsTableProps {
  address: BechAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const OpenedProposalsTable = ({
  address,
  onViewMore,
  refetchCount,
  scrollComponentId,
  totalData,
}: OpenedProposalsTableProps) => {
  const isMobile = useMobile();

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

  const { data: proposals, isLoading } = useProposalsByAddress(
    address,
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

  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <Box mt={{ base: 4, md: 8 }}>
      {isMobileOverview ? (
        <MobileTitle
          count={totalData}
          title="Opened proposals"
          onViewMore={onViewMore}
        />
      ) : (
        <AccountSectionWrapper title="Opened proposals" totalData={totalData}>
          <ProposalsTable
            emptyState={
              !proposals ? (
                <ErrorFetching
                  dataName="proposals"
                  hasBorderTop={false}
                  my={2}
                  withBorder
                />
              ) : (
                <AccountDetailsEmptyState message="No proposals have been opened by this account before." />
              )
            }
            isLoading={isLoading}
            proposals={proposals?.items}
          />
        </AccountSectionWrapper>
      )}
      {!!totalData &&
        (onViewMore
          ? totalData > 5 && !isMobile && <ViewMore onClick={onViewMore} />
          : totalData > 10 && (
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
            ))}
    </Box>
  );
};
