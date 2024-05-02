import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useLCDEndpoint,
} from "lib/app-provider";
import type { Option } from "lib/types";
import { extractTxLogs, isTxHash } from "lib/utils";

import type { TxData } from "./types";

const getTxDataLcd = async (
  endpoint: string,
  currentChainId: string,
  txHash: Option<string>
): Promise<TxData> => {
  const txData = await axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs/${txHash}`)
    .then(({ data }) => {
      return data;
    });

  const { tx_response: txResponse } = txData;

  const logs = extractTxLogs(txResponse);

  return {
    ...txResponse,
    logs,
    chainId: currentChainId,
    isTxFailed: Boolean(txResponse.code),
  };
};

export const useTxDataLcd = (txHash: Option<string>, enabled = true) => {
  const lcdEndpoint = useLCDEndpoint();
  const { currentChainId } = useCelatoneApp();

  return useQuery<TxData>(
    [CELATONE_QUERY_KEYS.TX_DATA_LCD, lcdEndpoint, txHash],
    async () => getTxDataLcd(lcdEndpoint, currentChainId, txHash),
    {
      enabled: enabled && Boolean(txHash && isTxHash(txHash)),
      refetchOnWindowFocus: false,
    }
  );
};
