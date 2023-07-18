import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { MobileTitle } from "../mobile/MobileTitle";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableTitle, ViewMore } from "lib/components/table";
import { useAccountContracts } from "lib/pages/account-details/data";
import type { ContractAddr, HumanAddr, Option } from "lib/types";

import { ContractsBody } from "./ContractsBody";

interface InstantiatedContractsTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

const ContractTitle = ({
  onViewMore,
  totalData,
}: {
  onViewMore: InstantiatedContractsTableProps["onViewMore"];
  totalData: Option<number>;
}) => {
  const isMobile = useMobile();
  if (isMobile && onViewMore)
    return (
      <MobileTitle
        title="Contract Instances"
        count={totalData ?? 0}
        onViewMore={onViewMore}
      />
    );
  return (
    <TableTitle
      title="Contract Instances"
      count={totalData ?? 0}
      helperText="This account instantiated the following contracts"
      mb={2}
    />
  );
};
export const InstantiatedContractsTable = ({
  walletAddress,
  scrollComponentId,
  totalData,
  refetchCount,
  onViewMore,
}: InstantiatedContractsTableProps) => {
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
  const isMobile = useMobile();
  let isMobileDetail = null;
  if (isMobile && onViewMore) {
    isMobileDetail = false;
  } else {
    isMobileDetail = true;
  }
  return (
    <Box mt={{ base: 4, md: 8 }}>
      <ContractTitle totalData={totalData} onViewMore={onViewMore} />
      {isMobileDetail && (
        <ContractsBody
          contracts={contracts}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              message={
                !contracts ? (
                  <ErrorFetching />
                ) : (
                  "This account did not instantiate any contracts before."
                )
              }
              withBorder
            />
          }
          onRowSelect={onRowSelect}
          onViewMore={onViewMore}
        />
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
