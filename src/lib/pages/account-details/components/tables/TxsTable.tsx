import { Alert, AlertDescription, Box, Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { CustomIcon } from "lib/components/icon";
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

  const {
    data: txsCount,
    refetch: refetchTxsCount,
    isLoading: txsCountLoading,
    failureReason,
  } = useTxsCountByAddress(walletAddress, accountId, "", filters, isSigner);

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
    if (failureReason) setPageSize(50);
  }, [failureReason, setPageSize]);

  return (
    <Box mt={8}>
      <Flex direction="row" justify="space-between" alignItems="center">
        <TableTitle
          title="Transactions"
          count={txsCount === undefined ? "N/A" : txsCount}
          mb={2}
        />
        {!onViewMore && (
          <Flex gap={4}>
            <TxRelationSelection
              setValue={(value: Option<boolean>) => {
                resetPagination();
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
      {Boolean(failureReason) && transactions?.length && (
        <Alert my={6} variant="error" gap={4}>
          <CustomIcon
            name="alert-circle-solid"
            boxSize={4}
            color="error.main"
          />
          <AlertDescription>
            This account has a high volume of transactions. Kindly note that{" "}
            <span style={{ fontWeight: 700 }}>
              we are only able to display up to 50 recent filtered transactions
            </span>{" "}
            at the time due to the large number of transactions.
          </AlertDescription>
        </Alert>
      )}
      <TransactionsTable
        transactions={transactions}
        isLoading={isLoading || txsCountLoading}
        emptyState={
          <EmptyState
            withBorder
            {...getEmptyStateProps(filterSelected, transactions)}
          />
        }
        showRelations
      />
      {Boolean(transactions?.length) &&
        (onViewMore
          ? !txsCountLoading &&
            (txsCount === undefined || txsCount > 5) && (
              <ViewMore onClick={onViewMore} />
            )
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
