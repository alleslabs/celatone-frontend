import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useAssetInfos } from "lib/services/assetService";
import { useTxsByPoolId } from "lib/services/tx";
import type { PoolData, PoolTxFilter } from "lib/types";

import { PoolTxsTable } from "./PoolTxsTable";

interface PoolRelatedTxsTableProps {
  countTxs: number;
  pool: PoolData;
  scrollComponentId: string;
  type: PoolTxFilter;
}

export const PoolRelatedTxsTable = ({
  countTxs,
  pool,
  scrollComponentId,
  type,
}: PoolRelatedTxsTableProps) => {
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });

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
    total: countTxs,
  });

  const {
    data: txs,
    isError,
    isLoading,
  } = useTxsByPoolId(pool.id, type, pageSize, offset);

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <>
      <PoolTxsTable
        emptyState={
          isError ? (
            <ErrorFetching dataName="transactions" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="There are no transactions in this network."
              withBorder
            />
          )
        }
        assetInfos={assetInfos}
        isLoading={isLoadingAssetInfos || isLoading}
        pool={pool}
        transactions={txs?.items}
      />
      {countTxs > 0 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          scrollComponentId={scrollComponentId}
          totalData={countTxs}
        />
      )}
    </>
  );
};
