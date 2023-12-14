import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable } from "lib/components/table";
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useTxsByAddress } from "lib/services/txService";
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

  const { data, isLoading } = useTxsByAddress(
    contractAddress,
    undefined,
    undefined,
    DEFAULT_TX_FILTERS,
    offset,
    pageSize
  );

  return (
    <>
      <TransactionsTable
        transactions={data?.items}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="This contract does not have any transactions"
          />
        }
        showRelations={false}
      />
      {!!totalData && totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
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
