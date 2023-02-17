import type { StdSignature } from "@cosmjs/amino";
import type { Event, StdFee } from "@cosmjs/stargate";
import type { Log } from "@cosmjs/stargate/build/logs";
import axios from "axios";

import type { Dict, Option } from "lib/types";
import { parseDateOpt, snakeToCamel } from "lib/utils";

export interface TxValueMsg {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: Dict<string, any>;
}

interface TxValue {
  msg: TxValueMsg[];
  fee: StdFee;
  signatures: StdSignature[];
  memo: string;
  timeoutHeight: string;
}

interface Tx {
  type: string;
  value: TxValue;
}

export interface TxResponse {
  code?: number;
  codespace?: string;
  data?: string;
  events: Event[];
  gasUsed: string;
  gasWanted: string;
  height: string;
  logs: Log[] | null;
  rawLog: string;
  timestamp: Option<Date>;
  tx: Tx;
  txhash: string;
}

export const queryTxData = async (
  endpoint: string,
  txHash: string
): Promise<TxResponse> => {
  const { data } = await axios.get(`${endpoint}/txs/${txHash}`);

  const txData: TxResponse = {
    ...data,
    timestamp: parseDateOpt(data.timestamp),
  };

  return snakeToCamel(txData) as TxResponse;
};
