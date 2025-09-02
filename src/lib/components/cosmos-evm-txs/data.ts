import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { BechAddr20, Nullish } from "lib/types";

import {
  useEvmTxHashesByCosmosTxHashes,
  useEvmTxsDataJsonRpc,
  useTxsByAddressPaginationSequencer,
} from "lib/services/tx";
import { useEffect, useState } from "react";

export const useCosmosEvmTxs = (address: BechAddr20) => {
  const [evmTxs, setEvmTxs] = useState<TxDataWithTimeStampJsonRpc[]>([]);
  const [paginationKey, setPaginationKey] =
    useState<Nullish<string>>(undefined);
  const [cosmosTxsCount, setCosmosTxsCount] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    data: cosmosTxs,
    isError: isCosmosTxsError,
    isFetching: isCosmosTxsFetching,
  } = useTxsByAddressPaginationSequencer(
    address,
    paginationKey ?? undefined,
    10,
    isInitialLoading
  );

  const {
    data: newEvmTxHashes,
    isError: isNewEvmHashesError,
    isFetching: isNewEvmHashesFetching,
  } = useEvmTxHashesByCosmosTxHashes(
    cosmosTxs?.items.map((tx) => tx.hash) ?? [],
    !!cosmosTxs && !isCosmosTxsFetching
  );

  const {
    data: newEvmTxsData,
    isError: isNewEvmTxsDataError,
    isFetching: isNewEvmTxsDataFetching,
  } = useEvmTxsDataJsonRpc(
    (newEvmTxHashes ?? []).filter((tx) => tx !== null) as string[],
    !!newEvmTxHashes && !isNewEvmHashesFetching
  );

  useEffect(() => {
    if (!cosmosTxs || !newEvmTxHashes || !newEvmTxsData) return;

    const pageEvmTxs: TxDataWithTimeStampJsonRpc[] = [];
    newEvmTxHashes.forEach((evmTxHash, index) => {
      if (evmTxHash !== null && newEvmTxsData[index]) {
        pageEvmTxs.push({
          ...newEvmTxsData[index],
          timestamp: cosmosTxs.items[index].created,
        });
      }
    });

    setEvmTxs((prev) =>
      paginationKey ? [...prev, ...pageEvmTxs] : pageEvmTxs
    );
    setCosmosTxsCount((prev) =>
      paginationKey ? prev + cosmosTxs.items.length : cosmosTxs.items.length
    );
    setIsInitialLoading(false);
  }, [cosmosTxs, newEvmTxHashes, newEvmTxsData, paginationKey]);

  const fetchNextPage = () => {
    if (cosmosTxs?.pagination?.nextKey) {
      setPaginationKey(cosmosTxs.pagination.nextKey);
      setIsInitialLoading(true);
    }
  };

  const isFetching =
    isCosmosTxsFetching || isNewEvmHashesFetching || isNewEvmTxsDataFetching;
  const isError =
    isCosmosTxsError || isNewEvmHashesError || isNewEvmTxsDataError;

  return {
    cosmosTxsCount,
    data: evmTxs,
    fetchNextPage,
    hasNextPage: !!cosmosTxs?.pagination?.nextKey,
    isError,
    isFetchingNextPage: isFetching,
    isLoading: isInitialLoading && !isError,
  };
};
