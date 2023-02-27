import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { useExecuteTxsByContractAddressPagination } from "lib/services/txService";
import type { ContractAddr, Option } from "lib/types";

interface ExecuteTxsTableProps {
  contractAddress: ContractAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
}

export const ExecuteTxsTable = ({
  contractAddress,
  scrollComponentId,
  totalData,
  refetchCount,
}: ExecuteTxsTableProps) => {
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

  const { data: executeTransactions, isLoading } =
    useExecuteTxsByContractAddressPagination(contractAddress, offset, pageSize);

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
      <TransactionsTable
        transactions={executeTransactions}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            message="This contract does not have any execute transactions yet."
            withBorder
          />
        }
      />
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
