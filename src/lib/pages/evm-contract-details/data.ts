import { useEffect, useState } from "react";

import {
  useEvmTxHashesByCosmosTxHashes,
  useTxsDataJsonRpc,
} from "lib/services/tx";
import type { Option, Transaction } from "lib/types";

export const useContractDetailsEvmTxs = (txsData: Option<Transaction[]>) => {
  const [data, setData] = useState(new Map());

  const { data: evmTxHashes, isFetching: isEvmHashesFetching } =
    useEvmTxHashesByCosmosTxHashes(txsData?.map((tx) => tx.hash));

  const { data: evmTxsData, isFetching: isEvmTxsDataFetching } =
    useTxsDataJsonRpc(evmTxHashes);

  useEffect(() => {
    if (!evmTxsData || !txsData) return;
    const newData = new Map(data);
    evmTxsData.forEach((tx, index) => {
      const { transactionHash } = tx.txReceipt;
      newData.set(transactionHash, {
        ...tx,
        timestamp: txsData[index].created,
      });
    });
    setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmTxsData]);

  return {
    data: Array.from(data.values()),
    isLoading: isEvmTxsDataFetching,
    isFetching: isEvmTxsDataFetching || isEvmHashesFetching,
  };
};
