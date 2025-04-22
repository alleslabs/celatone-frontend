import type { BechAddr32, Option } from "lib/types";

import { useTierConfig } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useTxsByAddress, useTxsByContractAddressRest } from "lib/services/tx";

interface TxsTableProps {
  contractAddress: BechAddr32;
  refetchCount: () => void;
  scrollComponentId: string;
  totalData: Option<number>;
}

export const TxsTable = ({
  contractAddress,
  refetchCount,
  scrollComponentId,
  totalData,
}: TxsTableProps) => {
  const { isFullTier } = useTierConfig();

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

  const resApi = useTxsByAddress(
    contractAddress,
    undefined,
    undefined,
    DEFAULT_TX_FILTERS,
    pageSize,
    offset,
    { enabled: isFullTier }
  );
  const resRest = useTxsByContractAddressRest(
    contractAddress,
    pageSize,
    offset,
    {
      enabled: !isFullTier,
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  const { data, error, isLoading } = isFullTier ? resApi : resRest;

  return (
    <>
      <TransactionsTable
        emptyState={
          error ? (
            <ErrorFetching dataName="transactions" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message={
                isFullTier
                  ? "This contract does not have any transactions."
                  : "This contract does not have any transactions, or they are too old and have been pruned from the REST."
              }
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
            refetchCount();
          }}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
            refetchCount();
          }}
        />
      )}
    </>
  );
};
