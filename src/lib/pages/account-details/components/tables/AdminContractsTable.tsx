import type { BechAddr, BechAddr32, Option } from "lib/types";
import type { ChangeEvent } from "react";

import { Box } from "@chakra-ui/react";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ErrorFetching } from "lib/components/state";
import { ContractsTable, MobileTitle, ViewMore } from "lib/components/table";
import { useAccountAdminContracts } from "lib/pages/account-details/data";
import { observer } from "mobx-react-lite";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import AccountSectionWrapper from "../AccountSectionWrapper";

interface AdminContractsTableProps {
  address: BechAddr;
  onViewMore?: () => void;
  refetchCount: () => void;
  scrollComponentId: string;
  totalData: Option<number>;
}

export const AdminContractsTable = observer(
  ({
    address,
    onViewMore,
    refetchCount,
    scrollComponentId,
    totalData,
  }: AdminContractsTableProps) => {
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
    const { contracts, isLoading } = useAccountAdminContracts(
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
            title="Contract admins"
            onViewMore={onViewMore}
          />
        ) : (
          <AccountSectionWrapper
            hasHelperText={!!contracts?.length}
            helperText="This account is the admin for following contracts"
            title="Contract admins"
            totalData={totalData}
          >
            <ContractsTable
              contracts={contracts}
              emptyState={
                !contracts ? (
                  <ErrorFetching
                    dataName="admin contracts"
                    hasBorderTop={false}
                    my={2}
                    withBorder
                  />
                ) : (
                  <AccountDetailsEmptyState message="This account does not have any admin access for any contracts." />
                )
              }
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
  }
);
