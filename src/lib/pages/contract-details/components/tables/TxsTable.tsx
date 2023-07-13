import { Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { useMobile } from "lib/app-provider";
import { TransactionCard } from "lib/components/card/TransactionCard";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useTxsByAddressPagination } from "lib/services/txService";
import type { ContractAddr, Option } from "lib/types";

interface TxsTableProps {
  contractAddress: ContractAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
}

export const TxsTable = ({
  contractAddress,
  scrollComponentId,
  totalData,
  refetchCount,
}: TxsTableProps) => {
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

  const { data: transactions, isLoading } = useTxsByAddressPagination(
    contractAddress,
    undefined,
    "",
    DEFAULT_TX_FILTERS,
    undefined,
    offset,
    pageSize
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
  const isMobile = useMobile();
  const emptyState = (
    <EmptyState
      imageVariant="empty"
      message="This contract does not have any transactions"
    />
  );
  if (!transactions?.length) return emptyState;
  return (
    <>
      {isMobile ? (
        <Flex direction="column" gap={4} w="full" mt={4}>
          {transactions.map((transaction) => (
            <TransactionCard
              transaction={transaction}
              key={`contract-detail-txs-${transaction.hash}`}
              showRelations={false}
            />
          ))}
        </Flex>
      ) : (
        <TransactionsTable
          transactions={transactions}
          isLoading={isLoading}
          emptyState={emptyState}
          showRelations={false}
        />
      )}
      {!!totalData && totalData > 10 && (
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
      )}
    </>
  );
};
