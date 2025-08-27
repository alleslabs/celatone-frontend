import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { BechAddr20, Nullish } from "lib/types";

import {
  useEvmTxHashesByCosmosTxHashes,
  useEvmTxsDataJsonRpc,
  useTxsByAddressPaginationSequencer,
} from "lib/services/tx";
import { isUndefined } from "lodash";
import { useEffect, useState } from "react";

export const useCosmosEvmTxs = (address: BechAddr20) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [evmTxs, setEvmTxs] = useState<TxDataWithTimeStampJsonRpc[]>();
  const [paginationKey, setPaginationKey] = useState<Nullish<string>>();
  const [cosmosTxsCount, setCosmosTxsCount] = useState(0);

  const {
    data: cosmosTxs,
    isError: isCosmosTxsError,
    isFetching: isCosmosTxsFetching,
    refetch,
  } = useTxsByAddressPaginationSequencer(
    address,
    paginationKey ?? undefined,
    10,
    evmTxs === undefined
  );
  const {
    data: newEvmTxHashes,
    isError: isNewEvmHashesError,
    isFetching: isNewEvmHashesFetching,
  } = useEvmTxHashesByCosmosTxHashes(
    cosmosTxs?.items.map((tx) => tx.item.hash),
    !isCosmosTxsFetching
  );
  const {
    data: newEvmTxsData,
    isError: isNewEvmTxsDataError,
    isFetching: isNewEvmTxsDataFetching,
  } = useEvmTxsDataJsonRpc(
    newEvmTxHashes?.filter((tx) => tx !== null) as string[],
    !isCosmosTxsFetching && !isNewEvmHashesFetching
  );

  useEffect(() => {
    if (
      isUndefined(cosmosTxs) ||
      isUndefined(newEvmTxHashes) ||
      isUndefined(newEvmTxsData) ||
      paginationKey === null
    )
      return;

    const newEvmTxs: TxDataWithTimeStampJsonRpc[] = [];
    newEvmTxHashes.forEach((evmTxHash, index) => {
      if (evmTxHash !== null)
        newEvmTxs.push({
          ...newEvmTxsData[newEvmTxs.length],
          timestamp: cosmosTxs.items[index].item.created,
        });
    });

    setEvmTxs((evmTxs ?? []).concat(newEvmTxs));
    setCosmosTxsCount(cosmosTxsCount + cosmosTxs.items.length);
    setPaginationKey(cosmosTxs.pagination.nextKey);
    setIsInitialLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newEvmTxsData]);

  const isFetching =
    isCosmosTxsFetching || isNewEvmHashesFetching || isNewEvmTxsDataFetching;
  const isError =
    isCosmosTxsError || isNewEvmHashesError || isNewEvmTxsDataError;
  return {
    cosmosTxsCount,
    data: evmTxs,
    fetchNextPage: refetch,
    hasNextPage: paginationKey !== null,
    isError,
    isFetchingNextPage: isFetching,
    isLoading: isInitialLoading && !isError,
  };
};
