import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import {
  ContractsTable,
  MobileTitle,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import { useAccountAdminContracts } from "lib/pages/account-details/data";
import type { BechAddr, BechAddr32, Option } from "lib/types";

interface AdminContractsTableProps {
  address: BechAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const AdminContractsTable = observer(
  ({
    address,
    scrollComponentId,
    totalData,
    refetchCount,
    onViewMore,
  }: AdminContractsTableProps) => {
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
            title="Contract Admins"
            count={totalData}
            onViewMore={onViewMore}
          />
        ) : (
          <>
            <TableTitle
              title="Contract Admins"
              count={totalData}
              helperText="This account is the admin for following contracts"
              mb={2}
            />
            <ContractsTable
              contracts={contracts}
              isLoading={isLoading}
              emptyState={
                !contracts ? (
                  <ErrorFetching dataName="contracts" />
                ) : (
                  <EmptyState
                    message="This account does not have any admin access for any contracts."
                    withBorder
                  />
                )
              }
              onRowSelect={onRowSelect}
            />
          </>
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
  }
);
