import { useEffect, useState } from "react";

import {
  useEvmTxHashesByCosmosTxHashes,
  useTxsByAddressPaginationSequencer,
  useTxsDataJsonRpc,
} from "lib/services/tx";
import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { BechAddr20, Nullish } from "lib/types";

export const useContractDetailsEvmTxs = (address: BechAddr20) => {
  const [evmTxs, setEvmTxs] = useState<TxDataWithTimeStampJsonRpc[]>();
  const [paginationKey, setPaginationKey] = useState<Nullish<string>>();
  const [cosmosTxsCount, setCosmosTxsCount] = useState(0);

  const {
    data: cosmosTxs,
    isFetching: isCosmosTxsFetching,
    isError: isCosmosTxsError,
    refetch,
  } = useTxsByAddressPaginationSequencer(
    address,
    paginationKey ?? undefined,
    10,
    evmTxs === undefined
  );
  const {
    data: newEvmTxHashes,
    isFetching: isNewEvmHashesFetching,
    isError: isNewEvmHashesError,
  } = useEvmTxHashesByCosmosTxHashes(
    cosmosTxs?.items.map((tx) => tx.hash),
    !isCosmosTxsFetching
  );
  const {
    data: newEvmTxsData,
    isFetching: isNewEvmTxsDataFetching,
    isError: isNewEvmTxsDataError,
  } = useTxsDataJsonRpc(
    newEvmTxHashes?.filter((tx) => tx !== null) as string[],
    !isCosmosTxsFetching && !isNewEvmHashesFetching
  );

  useEffect(() => {
    if (!cosmosTxs || !newEvmTxHashes || !newEvmTxsData) return;

    const newEvmTxs: TxDataWithTimeStampJsonRpc[] = [];
    newEvmTxHashes.forEach((evmTxHash, index) => {
      if (evmTxHash !== null)
        newEvmTxs.push({
          ...newEvmTxsData[newEvmTxs.length],
          timestamp: cosmosTxs.items[index].created,
        });
    });

    setEvmTxs((prev) => (prev ?? []).concat(newEvmTxs));
    setPaginationKey(cosmosTxs.pagination.nextKey);
    setCosmosTxsCount((prev) => prev + cosmosTxs.items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newEvmTxsData]);

  const isFetching =
    isCosmosTxsFetching || isNewEvmHashesFetching || isNewEvmTxsDataFetching;
  return {
    data: evmTxs,
    isLoading: evmTxs === undefined && isFetching,
    isError: isCosmosTxsError || isNewEvmHashesError || isNewEvmTxsDataError,
    fetchNextPage: () => {
      refetch({ cancelRefetch: true });
    },
    isFetchingNextPage: isFetching,
    hasNextPage: paginationKey !== null,
    cosmosTxsCount,
  };
};
