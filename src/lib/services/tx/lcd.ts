import axios from "axios";

import { extractTxLogs } from "lib/utils";

import type { TxData } from "./types";

export const getTxDataLcd = async (
  endpoint: string,
  currentChainId: string,
  txHash: string
): Promise<TxData> => {
  const txData = await axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`)
    .then(({ data }) => data);

  const { tx_response: txResponse } = txData;

  const logs = extractTxLogs(txResponse);

  return {
    ...txResponse,
    logs,
    chainId: currentChainId,
    isTxFailed: Boolean(txResponse.code),
  };
};
