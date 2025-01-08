import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { AccountDetailsEmptyState } from "../../AccountDetailsEmptyState";
import AccountSectionWrapper from "../../AccountSectionWrapper";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ErrorFetching } from "lib/components/state";
import { ContractsTable, MobileTitle, ViewMore } from "lib/components/table";
import { useAccountContracts } from "lib/pages/account-details/data";
import type { BechAddr32 } from "lib/types";

import type { InstantiatedContractsTableProps } from "./types";

export const InstantiatedContractsTableFull = ({
  address,
  onViewMore,
  refetchCount,
  scrollComponentId,
  totalData,
}: InstantiatedContractsTableProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const onRowSelect = (contract: BechAddr32) =>
    navigate({
      pathname: "/contracts/[contract]",
      query: { contract },
    });

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
          hasHelperText={!!contracts?.length}
          helperText="This account instantiated the following contracts"
          title="Contract Instances"
          totalData={totalData}
        >
          <ContractsTable
            emptyState={
              !contracts ? (
                <ErrorFetching
                  dataName="instantiated contracts"
                  my={2}
                  hasBorderTop={false}
                  withBorder
                />
              ) : (
                <AccountDetailsEmptyState message="No contracts have been instantiated by this account before." />
              )
            }
            contracts={contracts}
            isLoading={isLoading}
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
