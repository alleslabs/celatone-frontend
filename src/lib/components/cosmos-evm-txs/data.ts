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
  const [paginationKey, setPaginationKey] = useState<Nullish<string>>();
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
    cosmosTxs?.items.map((tx) => tx.item.hash) ?? [],
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
          timestamp: cosmosTxs.items[index].item.created,
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

export const useCosmosEvmTxsV2 = (hashes: string[]) => {
  const [evmTxs, setEvmTxs] = useState<TxDataWithTimeStampJsonRpc[]>();

  const { data: evmTxHashes } = useEvmTxHashesByCosmosTxHashes(hashes);
  const { data, isError, isLoading } = useEvmTxsDataJsonRpc(
    evmTxHashes?.filter((tx) => tx !== null) as string[]
  );

  useEffect(() => {
    const newEvmTxs: TxDataWithTimeStampJsonRpc[] = [];

    const sliceValue = evmTxs?.length ?? 0;
    data?.slice(sliceValue).forEach((tx) => {
      newEvmTxs.push({
        ...tx,
        timestamp: new Date(),
      });
    });

    setEvmTxs((evmTxs ?? []).concat(newEvmTxs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    data: evmTxs,
    isError,
    isLoading: !isError && evmTxs === undefined && isLoading,
  };
};
