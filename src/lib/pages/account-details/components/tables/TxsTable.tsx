// TODO - Refactor: move common component out of pasttx
import { Box, Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import {
  TableTitle,
  TransactionsNoSenderTable,
  ViewMore,
} from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useTxQuery } from "lib/services/txQuery/useTxQuery";
import type { HumanAddr, Option, TxFilters } from "lib/types";

interface TxsTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

interface TxsTableBodyProps extends TxsTableProps {
  filters: TxFilters;
  filterSelected: string[];
}

const TxsTableBody = ({
  walletAddress,
  scrollComponentId,
  totalData,
  refetchCount,
  onViewMore,
  filters,
  filterSelected,
}: TxsTableBodyProps) => {
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

  const { data: transactions, isLoading } = useTxQuery(
    walletAddress,
    "",
    filters,
    onViewMore ? 5 : pageSize,
    offset
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

  return (
    <>
      <TransactionsNoSenderTable
        transactions={transactions}
        isLoading={isLoading}
        emptyState={
          !filterSelected.length ? (
            <EmptyState
              message="This account did not submit any transactions before."
              withBorder
            />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="No past transaction matches found with your input."
              withBorder
            />
          )
        }
      />
      {!!totalData &&
        (onViewMore
          ? totalData > 5 && <ViewMore onClick={onViewMore} />
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
    </>
  );
};

export const TxsTable = (txsTableProps: TxsTableProps) => {
  const [filters, setFilters] = useState<TxFilters>(DEFAULT_TX_FILTERS);

  const handleSetFilters = (filter: string, bool: boolean) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: bool }));
  };

  const filterSelected = Object.keys(filters).filter(
    (key) => filters[key as keyof typeof filters]
  );

  const { totalData, onViewMore } = txsTableProps;
  return (
    <Box mt={12} mb={4}>
      <Flex direction="row" justify="space-between" alignItems="center">
        <TableTitle title="Transactions" count={totalData ?? 0} mb={0} />
        {!onViewMore && (
          <TxFilterSelection
            result={filterSelected}
            setResult={handleSetFilters}
            boxWidth="400px"
            placeholder="All"
          />
        )}
      </Flex>
      <TxsTableBody
        {...txsTableProps}
        filters={filters}
        filterSelected={filterSelected}
      />
    </Box>
  );
};
