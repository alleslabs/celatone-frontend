import type { Option, Transaction, TxFilters } from "lib/types";

import { Box } from "@chakra-ui/react";
import { useCurrentChain, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTitle, TransactionsTable, ViewMore } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useTxsByAddress, useTxsCountByAddress } from "lib/services/tx";
import { useEffect, useMemo, useState } from "react";

import type { TxsTableProps } from "./types";

import { AccountDetailsEmptyState } from "../../AccountDetailsEmptyState";
import { TxsAlert } from "./TxsAlert";
import { TxsTop } from "./TxsTop";

const getEmptyState = ({
  selectedFilters,
  transactions,
}: {
  transactions: Option<Transaction[]>;
  selectedFilters: string[];
}) => {
  if (!transactions) {
    return (
      <ErrorFetching
        dataName="transactions"
        hasBorderTop={false}
        my={2}
        withBorder
      />
    );
  }
  if (selectedFilters.length)
    return (
      <EmptyState
        imageVariant="not-found"
        message="No past transaction matches found with your input."
        withBorder
      />
    );

  return (
    <AccountDetailsEmptyState
      message="No transactions have been submitted by this account before."
      pt={4}
    />
  );
};

export const TxsTableFull = ({
  address,
  onViewMore,
  refetchCount,
  scrollComponentId,
}: TxsTableProps) => {
  const { chainId } = useCurrentChain();
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
    total: txsCount,
  });

  const { data: transactions, isLoading } = useTxsByAddress(
    address,
    undefined,
    isSigner,
    filters,
    onViewMore ? 5 : pageSize,
    offset
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

  const selectedFilters = useMemo(
    () =>
      Object.keys(filters).filter(
        (key) => filters[key as keyof typeof filters]
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(filters)]
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
          count={txsCount}
          title="Transactions"
          onViewMore={onViewMore}
        />
      ) : (
        <>
          <TxsTop
            relationSelection={
              <TxRelationSelection
                setValue={handleOnIsSignerChange}
                size="lg"
                value={isSigner}
                w={{ base: "full", md: "200px" }}
              />
            }
            txsCount={txsCount}
            txTypeSelection={
              <TxFilterSelection
                boxWidth={{ base: "full", md: "285px" }}
                placeholder="All"
                result={selectedFilters}
                setResult={handleOnFiltersChange}
                size="lg"
                tagSize={{ base: "sm", md: "md" }}
              />
            }
            onViewMore={onViewMore}
          />
          {isTxsCountTimeout && <TxsAlert />}
          {!isMobileOverview && (
            <TransactionsTable
              emptyState={getEmptyState({
                selectedFilters,
                transactions: transactions?.items,
              })}
              isLoading={isLoading || isTxCountLoading}
              showRelations
              transactions={transactions?.items}
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
                    offset={offset}
                    pageSize={pageSize}
                    pagesQuantity={pagesQuantity}
                    scrollComponentId={scrollComponentId}
                    totalData={txsCount}
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
        </>
      )}
    </Box>
  );
};
