import { useEffect, useMemo, useState } from "react";

import {
  useEvmTxHashesByCosmosTxHashes,
  useTxsDataJsonRpc,
} from "lib/services/tx";
import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { Option, Transaction } from "lib/types";

export const useContractDetailsEvmTxs = (txsData: Option<Transaction[]>) => {
  const [data, setData] = useState<TxDataWithTimeStampJsonRpc[]>([]);
  const txHashes = useMemo(() => txsData?.map((tx) => tx.hash), [txsData]);

  const { data: evmTxHashes, isFetching: isEvmHashesFetching } =
    useEvmTxHashesByCosmosTxHashes(txHashes);

  const filteredEvmTxHashes = useMemo(
    () => evmTxHashes?.filter((tx): tx is string => tx !== null),
    [evmTxHashes]
  );

  const { data: evmTxsData, isFetching: isEvmTxsDataFetching } =
    useTxsDataJsonRpc(filteredEvmTxHashes);

  useEffect(() => {
    if (!evmTxHashes || !txsData || !evmTxsData) return;

    const newData: TxDataWithTimeStampJsonRpc[] = [];

    evmTxHashes.forEach((tx, index) => {
      if (tx !== null) {
        newData.push({
          ...evmTxsData[newData.length],
          timestamp: txsData[index].created,
        });
      }
    });

    setData((prev) => prev.concat(...newData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmTxsData]);

  return {
    data,
    isLoading: isEvmTxsDataFetching,
    isFetching: isEvmTxsDataFetching || isEvmHashesFetching,
  };
};
