import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import AccountSectionWrapper from "../../AccountSectionWrapper";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ContractsTable, MobileTitle, ViewMore } from "lib/components/table";
import { useAccountContracts } from "lib/pages/account-details/data";
import type { BechAddr32 } from "lib/types";

import type { InstantiatedContractsTableProps } from "./types";

export const InstantiatedContractsTableFull = ({
  address,
  scrollComponentId,
  totalData,
  refetchCount,
  onViewMore,
}: InstantiatedContractsTableProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const onRowSelect = (contract: BechAddr32) =>
    navigate({
      pathname: "/contracts/[contract]",
      query: { contract },
    });

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
  const { contracts, isLoading } = useAccountContracts(
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
          title="Contract Instances"
          count={totalData}
          onViewMore={onViewMore}
        />
      ) : (
        <AccountSectionWrapper
          totalData={totalData}
          title="Contract Instances"
          helperText="This account instantiated the following contracts"
          hasHelperText={!!contracts?.length}
        >
          <ContractsTable
            contracts={contracts}
            isLoading={isLoading}
            emptyState={
              !contracts ? (
                <ErrorFetching dataName="contracts" />
              ) : (
                <EmptyState
                  message="No contracts have been instantiated by this account before."
                  withBorder
                />
              )
            }
            onRowSelect={onRowSelect}
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
