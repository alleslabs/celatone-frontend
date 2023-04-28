import { Box, Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { ErrorFetching } from "../common";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import type { EmptyStateProps } from "lib/components/state";
import { EmptyState } from "lib/components/state";
import { TableTitle, TransactionsTable, ViewMore } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import {
  useTxsByAddressPagination,
  useTxsCountByAddress,
} from "lib/services/txService";
import type { HumanAddr, Option, Transaction, TxFilters } from "lib/types";

interface TxsTableProps {
  walletAddress: HumanAddr;
  accountId?: Option<number>;
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
  walletAddress,
  accountId,
  scrollComponentId,
  onViewMore,
}: TxsTableProps) => {
  const [isSigner, setIsSigner] = useState<Option<boolean>>();
  const [filters, setFilters] = useState<TxFilters>(DEFAULT_TX_FILTERS);

  const { data: txsCount = 0, refetch: refetchTxsCount } = useTxsCountByAddress(
    walletAddress,
    accountId,
    "",
    filters,
    isSigner
  );

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

  const handleSetFilters = (filter: string, bool: boolean) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: bool }));
  };

  const filterSelected = Object.keys(filters).filter(
    (key) => filters[key as keyof typeof filters]
  );

  const { data: transactions, isLoading } = useTxsByAddressPagination(
    undefined,
    accountId,
    "",
    filters,
    isSigner,
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
    setCurrentPage(1);
  }, [filters, isSigner, setCurrentPage]);

  return (
    <Box mt={8}>
      <Flex direction="row" justify="space-between" alignItems="center">
        <TableTitle title="Transactions" count={txsCount} mb={2} />
        {!onViewMore && (
          <Flex gap={1}>
            <TxRelationSelection
              setValue={(value: Option<boolean>) => {
                // setPageSize(10);
                setIsSigner(value);
              }}
              w="200px"
            />
            <TxFilterSelection
              result={filterSelected}
              setResult={handleSetFilters}
              boxWidth="285px"
              placeholder="All"
            />
          </Flex>
        )}
      </Flex>
      <TransactionsTable
        transactions={transactions}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            withBorder
            {...getEmptyStateProps(filterSelected, transactions)}
          />
        }
        showRelations
      />
      {!!txsCount &&
        Boolean(transactions?.length) &&
        (onViewMore
          ? txsCount > 5 && <ViewMore onClick={onViewMore} />
          : txsCount > 10 && (
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
