import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useAssetInfos } from "lib/services/assetService";
import { useTxsByPoolId } from "lib/services/tx";
import type { PoolData, PoolTxFilter } from "lib/types";

import { PoolTxsTable } from "./PoolTxsTable";

interface PoolRelatedTxsTableProps {
  pool: PoolData;
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
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });

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
    isError,
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
        pool={pool}
        transactions={txs?.items}
        assetInfos={assetInfos}
        isLoading={isLoadingAssetInfos || isLoading}
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
