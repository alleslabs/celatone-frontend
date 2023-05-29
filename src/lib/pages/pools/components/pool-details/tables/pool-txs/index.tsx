import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useAssetInfos } from "lib/services/assetService";
import { useTxsByPoolIdPagination } from "lib/services/txService";
import type { PoolDetail, PoolTxFilter } from "lib/types";

import { PoolTxsTable } from "./PoolTxsTable";

interface PoolRelatedTxsTableProps {
  pool: PoolDetail;
  countTxs: number;
  type: PoolTxFilter;
  scrollComponentId: string;
}

export const PoolRelatedTxsTable = ({
  pool,
  countTxs,
  type,
  scrollComponentId,
}: PoolRelatedTxsTableProps) => {
  const { assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos();

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
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const {
    data: txs,
    isLoading,
    error,
  } = useTxsByPoolIdPagination(pool.id, type, offset, pageSize);

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  if (error)
    return (
      <EmptyState
        imageVariant="not-found"
        message="There is an error during fetching transactions."
      />
    );
  return (
    <>
      <PoolTxsTable
        pool={pool}
        transactions={txs}
        assetInfos={assetInfos}
        isLoading={isLoadingAssetInfos || isLoading}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="There are no transactions in this network."
          />
        }
      />
      {countTxs > 0 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={countTxs}
          pageSize={pageSize}
          scrollComponentId={scrollComponentId}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};
