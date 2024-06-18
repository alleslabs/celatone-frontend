import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import AccountSectionWrapper from "../AccountSectionWrapper";
import { useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ErrorFetching } from "lib/components/state";
import { MobileTitle, ProposalsTable, ViewMore } from "lib/components/table";
import { useProposalsByAddress } from "lib/services/proposal";
import type { BechAddr, Option } from "lib/types";

interface OpenedProposalsTableProps {
  address: BechAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const OpenedProposalsTable = ({
  address,
  scrollComponentId,
  totalData,
  refetchCount,
  onViewMore,
}: OpenedProposalsTableProps) => {
  const isMobile = useMobile();

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
          title="Opened Proposals"
          count={totalData}
          onViewMore={onViewMore}
        />
      ) : (
        <AccountSectionWrapper title="Opened Proposals" totalData={totalData}>
          <ProposalsTable
            proposals={proposals?.items}
            isLoading={isLoading}
            emptyState={
              !proposals ? (
                <ErrorFetching
                  dataName="proposals"
                  withBorder
                  my={2}
                  hasBorderTop={false}
                />
              ) : (
                <AccountDetailsEmptyState message="No proposals have been opened by this account before." />
              )
            }
          />
        </AccountSectionWrapper>
      )}
      {!!totalData &&
        (onViewMore
          ? totalData > 5 && !isMobile && <ViewMore onClick={onViewMore} />
          : totalData > 10 && (
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
            ))}
    </Box>
  );
};
