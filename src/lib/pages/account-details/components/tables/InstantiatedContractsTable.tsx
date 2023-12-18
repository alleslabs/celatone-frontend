import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ErrorFetching, EmptyState } from "lib/components/state";
import {
  ContractsTable,
  MobileTitle,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import { useAccountContracts } from "lib/pages/account-details/data";
import type { ContractAddr, HumanAddr, Option } from "lib/types";

interface InstantiatedContractsTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const InstantiatedContractsTable = observer(
  ({
    walletAddress,
    scrollComponentId,
    totalData,
    refetchCount,
    onViewMore,
  }: InstantiatedContractsTableProps) => {
    const isMobile = useMobile();
    const navigate = useInternalNavigate();
    const onRowSelect = (contract: ContractAddr) =>
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
      walletAddress,
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
          <>
            <TableTitle
              title="Contract Instances"
              count={totalData}
              helperText="This account instantiated the following contracts"
              mb={2}
            />
            <ContractsTable
              contracts={contracts}
              isLoading={isLoading}
              emptyState={
                !contracts ? (
                  <ErrorFetching message="There is an error during fetching contracts." />
                ) : (
                  <EmptyState
                    message="This account did not instantiate any contracts before."
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
