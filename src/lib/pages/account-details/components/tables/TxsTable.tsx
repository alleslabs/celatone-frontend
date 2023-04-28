import { Box, Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableTitle, TransactionsTable, ViewMore } from "lib/components/table";
import { TxFilterSelection } from "lib/components/TxFilterSelection";
import { TxRelationSelection } from "lib/components/TxRelationSelection";
import { DEFAULT_TX_FILTERS } from "lib/data";
import {
  useTxsByAddressPagination,
  useTxsCountByAddress,
} from "lib/services/txService";
import type { HumanAddr, Option, TxFilters } from "lib/types";

interface TxsTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const TxsTable = ({
  walletAddress,
  scrollComponentId,
  totalData,
  refetchCount,
  onViewMore,
}: TxsTableProps) => {
  const [isSigner, setIsSigner] = useState<Option<boolean>>();
  const [filters, setFilters] = useState<TxFilters>(DEFAULT_TX_FILTERS);

  const { data: txsCount = 0 } = useTxsCountByAddress(
    walletAddress,
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
    walletAddress,
    "",
    filters,
    isSigner,
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
          !filterSelected.length ? (
            <EmptyState
              imageVariant="empty"
              message="This account did not submit any transactions before."
              withBorder
            />
          ) : (
            <EmptyState
              imageVariant="not-found"
              message="No past transaction matches found with your input."
              withBorder
            />
          )
        }
        showRelations
      />
      {!!totalData &&
        Boolean(transactions?.length) &&
        (onViewMore
          ? totalData > 5 && <ViewMore onClick={onViewMore} />
          : totalData > 10 && (
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
