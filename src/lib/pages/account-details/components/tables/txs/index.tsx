import { Box } from "@chakra-ui/react";
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
import { useTxsCountByAddress, useTxsByAddress } from "lib/services/txService";
import type { Addr, Option, Transaction, TxFilters } from "lib/types";

import { TxsAlert } from "./TxsAlert";
import { TxsTop } from "./TxsTop";

interface TxsTableProps {
  address: Addr;
  scrollComponentId: string;
  refetchCount: () => void;
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
  address,
  scrollComponentId,
  refetchCount,
  onViewMore,
}: TxsTableProps) => {
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  const [isSigner, setIsSigner] = useState<Option<boolean>>();
  const [filters, setFilters] = useState<TxFilters>(DEFAULT_TX_FILTERS);
  const isMobile = useMobile();

  const {
    data: rawTxCount,
    isLoading: isTxCountLoading,
    refetch: refetchTxsCount,
  } = useTxsCountByAddress(address, undefined, isSigner, filters);
  const txsCount = rawTxCount ?? undefined;
  const isTxsCountTimeout = rawTxCount === null;

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

  const { data: transactions, isLoading } = useTxsByAddress(
    address,
    undefined,
    isSigner,
    filters,
    offset,
    onViewMore ? 5 : pageSize
  );

  const handleOnIsSignerChange = (value: Option<boolean>) => {
    setCurrentPage(1);
    setIsSigner(value);
    refetchCount();
  };

  const handleOnFiltersChange = (filter: string, bool: boolean) => {
    setCurrentPage(1);
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: bool }));
    refetchCount();
  };

  const filterSelected = Object.keys(filters).filter(
    (key) => filters[key as keyof typeof filters]
  );

  useEffect(() => {
    if (isTxsCountTimeout) setPageSize(50);
  }, [isTxsCountTimeout, setPageSize]);

  useEffect(() => {
    setIsSigner(undefined);
    setFilters(DEFAULT_TX_FILTERS);
  }, [chainId]);

  const isMobileOverview = isMobile && !!onViewMore;
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
              setValue={handleOnIsSignerChange}
              w={{ base: "full", md: "200px" }}
              size="lg"
            />
          }
          txTypeSelection={
            <TxFilterSelection
              result={filterSelected}
              setResult={handleOnFiltersChange}
              boxWidth={{ base: "full", md: "285px" }}
              placeholder="All"
              size="lg"
              tagSize={{ base: "sm", md: "md" }}
            />
          }
        />
      )}
      {isTxsCountTimeout && <TxsAlert />}
      {!isMobileOverview && (
        <TransactionsTable
          transactions={transactions?.items}
          isLoading={isLoading || isTxCountLoading}
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
          ? !isTxCountLoading &&
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
                onPageChange={(nextPage) => {
                  setCurrentPage(nextPage);
                  refetchTxsCount();
                  refetchCount();
                }}
                onPageSizeChange={(e) => {
                  const size = Number(e.target.value);
                  setPageSize(size);
                  setCurrentPage(1);
                  refetchTxsCount();
                  refetchCount();
                }}
              />
            ))}
    </Box>
  );
};
