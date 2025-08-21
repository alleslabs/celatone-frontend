import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useTxsByAddress } from "lib/services/tx";

import type { TxsTableProps } from "./types";

export const TxsTableFull = ({
  contractAddress,
  refetchCount,
  scrollComponentId,
  totalData,
}: TxsTableProps) => {
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
    total: totalData,
  });

  const { data, error, isLoading } = useTxsByAddress(
    contractAddress,
    undefined,
    undefined,
    DEFAULT_TX_FILTERS,
    pageSize,
    offset
  );

  return (
    <>
      <TransactionsTable
        emptyState={
          error ? (
            <ErrorFetching dataName="transactions" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="This contract does not have any transactions."
              withBorder
            />
          )
        }
        isLoading={isLoading}
        showRelations={false}
        transactions={data?.items}
      />
      {!!totalData && totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          scrollComponentId={scrollComponentId}
          totalData={totalData}
          onPageChange={(nextPage) => {
            setCurrentPage(nextPage);
            refetchCount?.();
          }}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
            refetchCount?.();
          }}
        />
      )}
    </>
  );
};
