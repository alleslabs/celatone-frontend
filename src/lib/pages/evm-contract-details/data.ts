import { useEffect, useMemo, useState } from "react";

import {
  useEvmTxHashesByCosmosTxHashes,
  useTxsByAddressSequencer,
  useTxsDataJsonRpc,
} from "lib/services/tx";
import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { BechAddr20 } from "lib/types";

export const useContractDetailsTxs = (address: BechAddr20) => {
  const [evmTxs, setEvmTxs] = useState<TxDataWithTimeStampJsonRpc[]>();
  const [isEvmTxsLoading, setIsEvmTxsLoading] = useState(true);
  const [isEvmTxsFetching, setIsEvmTxsFetching] = useState(false);

  const cosmosTxHashToEvmTx = useMemo(
    () => new Map<string, TxDataWithTimeStampJsonRpc>(),
    []
  );

  const {
    data: cosmosTxs,
    fetchNextPage,
    hasNextPage,
    isFetching: isCosmosTxsLoading,
    isFetchingNextPage: isCosmosTxsFetchingNextpage,
    latestFetchedData: newCosmosTxs,
    isError: isCosmosTxsError,
  } = useTxsByAddressSequencer(address, undefined);

  const {
    data: newEvmTxHashes,
    isFetching: isEvmHashesFetching,
    isError: isEvmHashesError,
  } = useEvmTxHashesByCosmosTxHashes(newCosmosTxs?.map((tx) => tx.hash));
  const {
    data: evmTxsData,
    isFetching: isEvmTxsDataFetching,
    isError: isEvmTxsDataError,
  } = useTxsDataJsonRpc(
    newEvmTxHashes?.filter((tx) => tx !== null) as string[]
  );

  useEffect(() => {
    setIsEvmTxsFetching(true);
    if (!newCosmosTxs || !newEvmTxHashes || !evmTxsData) return;

    let evmTxsDataIndex = 0;
    newEvmTxHashes.forEach((txHash, index) => {
      if (txHash !== null) {
        cosmosTxHashToEvmTx.set(newCosmosTxs[index].hash, {
          ...evmTxsData[evmTxsDataIndex],
          timestamp: newCosmosTxs[index].created,
        });
        evmTxsDataIndex += 1;
      }
    });

    setEvmTxs(
      cosmosTxs
        ?.map(({ hash }) => cosmosTxHashToEvmTx.get(hash))
        .filter((tx) => tx !== undefined) as TxDataWithTimeStampJsonRpc[]
    );
    setIsEvmTxsLoading(false);
    setIsEvmTxsFetching(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmTxsData]);

  const isError = isCosmosTxsError || isEvmHashesError || isEvmTxsDataError;
  return {
    cosmosTxs,
    evmTxs,
    isCosmosTxsLoading,
    isCosmosTxsFetchingNextpage,
    isEvmTxsLoading: isEvmTxsLoading && !isError,
    isEvmTxsFetchingNextpage:
      (isCosmosTxsFetchingNextpage ||
        isEvmHashesFetching ||
        isEvmTxsDataFetching ||
        isEvmTxsFetching) &&
      !isError,
    fetchNextPage,
    hasNextPage,
  };
};
