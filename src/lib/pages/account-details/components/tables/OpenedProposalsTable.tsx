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
  onViewMore?: () => void;
  refetchCount: () => void;
  scrollComponentId: string;
  totalData: Option<number>;
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
          title="Opened Proposals"
          count={totalData}
          onViewMore={onViewMore}
        />
      ) : (
        <AccountSectionWrapper title="Opened Proposals" totalData={totalData}>
          <ProposalsTable
            emptyState={
              !proposals ? (
                <ErrorFetching
                  dataName="proposals"
                  my={2}
                  hasBorderTop={false}
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
                pageSize={pageSize}
                pagesQuantity={pagesQuantity}
                offset={offset}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                scrollComponentId={scrollComponentId}
                totalData={totalData}
              />
            ))}
    </Box>
  );
};
