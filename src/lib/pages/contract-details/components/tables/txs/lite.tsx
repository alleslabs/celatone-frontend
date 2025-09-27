import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { useQueryEvents } from "lib/hooks";
import { useTxsByContractAddressRest } from "lib/services/tx";

import type { TxsTableProps } from "./types";

export const TxsTableLite = ({
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
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
    total: totalData,
  });

  const txsByContractAddressRestQuery = useTxsByContractAddressRest(
    contractAddress,
    pageSize,
    offset
  );
  useQueryEvents(txsByContractAddressRestQuery, {
    onSuccess: ({ total }) => setTotalData(total),
  });
  const { data, error, isLoading } = txsByContractAddressRestQuery;

  return (
    <>
      <TransactionsTable
        emptyState={
          error ? (
            <ErrorFetching dataName="transactions" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="This contract does not have any transactions, or they are too old and have been pruned from the REST."
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
