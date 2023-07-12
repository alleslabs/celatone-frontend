import { Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { useMobile } from "lib/app-provider";
import { TransactionCard } from "lib/components/card/TransactionCard";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import {
  useTxsByBlockHeightPagination,
  useTxsCountByBlockHeight,
} from "lib/services/txService";

const scrollComponentId = "block_tx_table_header";

interface BlockTxsTableProps {
  height: number;
}

export const BlockTxsTable = ({ height }: BlockTxsTableProps) => {
  const { data: blockTxsCount = 0 } = useTxsCountByBlockHeight(height);
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: blockTxsCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const isMobile = useMobile();
  const { data: blockTxs, isLoading: isBlockTxsLoading } =
    useTxsByBlockHeightPagination(height, pageSize, offset);

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };
  if (!blockTxs?.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="There are no submitted transactions in this block"
        withBorder
      />
    );
  return (
    <>
      {isMobile ? (
        <Flex direction="column" gap={4} w="full" mt={4}>
          {blockTxs.map((transaction) => (
            <TransactionCard
              transaction={transaction}
              showRelations={false}
              showTimestamp={false}
            />
          ))}
        </Flex>
      ) : (
        <TransactionsTable
          transactions={blockTxs}
          isLoading={isBlockTxsLoading}
          emptyState={
            <EmptyState
              imageVariant="empty"
              message="There are no submitted transactions in this block"
              withBorder
            />
          }
          showRelations={false}
          showTimestamp={false}
        />
      )}
      {blockTxsCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={blockTxsCount}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};
