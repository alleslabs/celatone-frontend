import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { ErrorFetching } from "../../ErrorFetching";
import { useCurrentChain, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import type { EmptyStateProps } from "lib/components/state";
import { EmptyState } from "lib/components/state";
import { MobileTitle, TransactionsTable, ViewMore } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useTxsByAddress, useTxsCountByAddress } from "lib/services/txService";
import type { Addr, Nullable, Option, Transaction, TxFilters } from "lib/types";

import { TxsAlert } from "./TxsAlert";
import { TxsTop } from "./TxsTop";

interface TxsTableProps {
  accountId: Option<Nullable<number>>;
  address: Addr;
  scrollComponentId: string;
  onViewMore?: () => void;
}

const getEmptyStateProps = (
  filterSelected: string[],
  transactions: Option<Transaction[]>
): EmptyStateProps => {
  if (filterSelected.length) {
    return { message: "No past transaction matches found with your input." };
  }
  if (!transactions) {
    return {
      message: <ErrorFetching />,
    };
  }
  return {
    message: "This account did not submit any transactions before.",
  };
};

export const TxsTable = ({
  accountId,
  address,
  scrollComponentId,
  onViewMore,
}: TxsTableProps) => {
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  const [isSigner, setIsSigner] = useState<Option<boolean>>();
  const [filters, setFilters] = useState<TxFilters>(DEFAULT_TX_FILTERS);
  const isMobile = useMobile();

  const {
    data: txsCount,
    refetch: refetchTxsCount,
    isLoading: txsCountLoading,
    failureReason,
  } = useTxsCountByAddress({
    accountId,
    search: "",
    filters,
    isSigner,
  });

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: txsCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const resetPagination = () => {
    setPageSize(10);
    setCurrentPage(1);
  };

  const handleSetFilters = (filter: string, bool: boolean) => {
    resetPagination();
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: bool }));
  };

  const filterSelected = Object.keys(filters).filter(
    (key) => filters[key as keyof typeof filters]
  );

  const { data: transactions, isLoading } = useTxsByAddress(
    address,
    isSigner,
    filters,
    offset,
    onViewMore ? 5 : pageSize
  );

  const onPageChange = (nextPage: number) => {
    refetchTxsCount();
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetchTxsCount();
    setPageSize(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (failureReason) setPageSize(50);
  }, [failureReason, setPageSize]);

  useEffect(() => {
    setIsSigner(undefined);
    setFilters(DEFAULT_TX_FILTERS);
  }, [chainId]);

  const isMobileOverview = isMobile && !!onViewMore;
  const showErrorAlert =
    Boolean(failureReason) && Number(transactions?.items.length) > 0;
  return (
    <Box mt={{ base: 4, md: 8 }}>
      {isMobileOverview ? (
        <MobileTitle
          title="Transactions"
          count={txsCount}
          onViewMore={onViewMore}
        />
      ) : (
        <TxsTop
          txsCount={txsCount}
          onViewMore={onViewMore}
          relationSelection={
            <TxRelationSelection
              value={isSigner}
              setValue={(value: Option<boolean>) => {
                resetPagination();
                setIsSigner(value);
              }}
              w={{ base: "full", md: "200px" }}
              size="lg"
            />
          }
          txTypeSelection={
            <TxFilterSelection
              result={filterSelected}
              setResult={handleSetFilters}
              boxWidth={{ base: "full", md: "285px" }}
              placeholder="All"
              size="lg"
              tagSize={{ base: "sm", md: "md" }}
            />
          }
        />
      )}
      {showErrorAlert && <TxsAlert />}
      {!isMobileOverview && (
        <TransactionsTable
          transactions={transactions?.items}
          isLoading={isLoading || txsCountLoading}
          emptyState={
            <EmptyState
              withBorder
              {...getEmptyStateProps(filterSelected, transactions?.items)}
            />
          }
          showRelations
        />
      )}
      {Boolean(transactions?.items?.length) &&
        (onViewMore
          ? !txsCountLoading &&
            (txsCount === undefined || txsCount > 5) &&
            !isMobile && <ViewMore onClick={onViewMore} />
          : txsCount &&
            txsCount > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={txsCount}
                scrollComponentId={scrollComponentId}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            ))}
    </Box>
  );
};
