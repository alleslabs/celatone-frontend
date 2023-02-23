import { Box, Flex, Grid } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state/EmptyState";
import { TableContainer, TableHeader } from "lib/components/table";
import { TableTitle } from "lib/components/table/TableTitle";
import { ViewMore } from "lib/components/table/ViewMore";
import { FilterSelection } from "lib/pages/past-txs/components/FilterSelection";
import { useTxQuery } from "lib/pages/past-txs/query/useTxQuery";
import type { HumanAddr, Option, TxFilters } from "lib/types";

import { TxsTableRow } from "./TxsTableRow";

interface TransactionTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

interface TransactionTableBodyProps extends TransactionTableProps {
  filters: TxFilters;
  filterSelected: string[];
}

const TransactionTableBody = ({
  walletAddress,
  scrollComponentId,
  totalData,
  refetchCount,
  onViewMore,
  filters,
  filterSelected,
}: TransactionTableBodyProps) => {
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

  const templateColumnsStyle =
    "180px 70px minmax(360px, 1fr) max(250px) max(70px)";

  if (isLoading) return <Loading />;

  if (!transactions?.length && filterSelected.length > 0) {
    return (
      <Flex
        mt="20px"
        py="64px"
        direction="column"
        borderY="1px solid"
        borderColor="pebble.700"
      >
        <EmptyState
          image="https://assets.alleslabs.dev/illustration/search-empty.svg"
          message={`
        Transactions involving with Wasm module
        such as Instantiate, Execute, or Upload Wasm file will display here.
        `}
        />
      </Flex>
    );
  }

  if (!transactions?.length)
    return (
      <Flex
        mt="20px"
        py="64px"
        direction="column"
        borderY="1px solid"
        borderColor="pebble.700"
      >
        <EmptyState message="This account did not submit any transactions before." />
      </Flex>
    );

  return (
    <>
      <TableContainer>
        <Grid templateColumns={templateColumnsStyle}>
          <TableHeader>Transaction Hash</TableHeader>
          <TableHeader />
          <TableHeader>Messages</TableHeader>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader />
        </Grid>
        {transactions.map((transaction) => (
          <TxsTableRow
            key={transaction.hash}
            transaction={transaction}
            templateColumnsStyle={templateColumnsStyle}
          />
        ))}
      </TableContainer>
      {totalData &&
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

export const TransactionTable = (
  transactionTableProps: TransactionTableProps
) => {
  const [filters, setFilters] = useState<TxFilters>({
    isExecute: false,
    isInstantiate: false,
    isUpload: false,
    isIbc: false,
    isSend: false,
    isMigrate: false,
    isUpdateAdmin: false,
    isClearAdmin: false,
  });

  const handleSetFilters = (filter: string, bool: boolean) => {
    setFilters({ ...filters, [filter]: bool });
  };

  const filterSelected = useMemo(() => {
    return Object.keys(filters).reduce((acc: string[], key: string) => {
      if (filters[key as keyof typeof filters]) {
        acc.push(key);
      }
      return acc;
    }, []);
  }, [filters]);

  const { totalData, onViewMore } = transactionTableProps;
  return (
    <Box mt={12} mb={4}>
      <Flex direction="row" justify="space-between" alignItems="center">
        <TableTitle title="Transactions" count={totalData ?? 0} mb={0} />
        {!onViewMore && (
          <FilterSelection
            result={filterSelected}
            setResult={handleSetFilters}
            boxWidth="400px"
            placeholder="All"
          />
        )}
      </Flex>
      <TransactionTableBody
        {...transactionTableProps}
        filters={filters}
        filterSelected={filterSelected}
      />
    </Box>
  );
};
