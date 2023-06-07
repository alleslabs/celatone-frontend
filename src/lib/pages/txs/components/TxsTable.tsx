import { Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { useChainId, useMobile } from "lib/app-provider";
import { TransactionCard } from "lib/components/card/TransactionCard";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { useTxs, useTxsCount } from "lib/services/txService";

interface TxsTableProps {
  isViewMore: boolean;
}

export const TxsTable = ({ isViewMore }: TxsTableProps) => {
  const chainId = useChainId();
  const { data: countTxs = 0 } = useTxsCount();

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: countTxs,
    initialState: {
      pageSize: isViewMore ? 5 : 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data: txs, isLoading, error } = useTxs(offset, pageSize);

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };
  const isMobile = useMobile();
  useEffect(() => {
    if (!isViewMore) setPageSize(10);
    setCurrentPage(1);
  }, [chainId, isViewMore, setCurrentPage, setPageSize]);
  // TODO - Might consider adding this state in all transaction table
  if (error)
    return (
      <EmptyState
        withBorder
        imageVariant="not-found"
        message="There is an error during fetching transactions."
      />
    );
  if (isMobile)
    return (
      <>
        {txs ? (
          <Flex direction="column" gap={4} w="full" mt={4}>
            {txs?.map((transaction) => (
              <TransactionCard
                transaction={transaction}
                key={transaction.hash}
                showRelations={false}
              />
            ))}
            {!isViewMore && countTxs > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={countTxs}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            )}
          </Flex>
        ) : (
          <EmptyState
            withBorder
            imageVariant="empty"
            message="There are no transactions in this network."
          />
        )}
      </>
    );
  return (
    <>
      <TransactionsTable
        transactions={txs}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            withBorder
            imageVariant="empty"
            message="There are no transactions on this network."
          />
        }
        showAction={false}
        showRelations={false}
      />
      {!isViewMore && countTxs > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={countTxs}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};
