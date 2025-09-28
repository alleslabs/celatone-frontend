import { zHexAddr20, zHexBig, zPagination } from "lib/types";
import { z } from "zod";

import type { TxJsonRpc } from "../tx";

import { zTxReceiptJsonRpcLog } from "../tx";

const zEvmTxSequencer = z.object({
  blockHash: z.string(),
  blockNumber: z.string(),
  contractAddress: zHexAddr20.nullable(),
  cumulativeGasUsed: zHexBig,
  effectiveGasPrice: zHexBig,
  from: zHexAddr20,
  gasUsed: zHexBig,
  logs: z.array(zTxReceiptJsonRpcLog),
  logsBloom: z.string(),
  status: z.string(),
  to: zHexAddr20,
  transactionHash: z.string(),
  transactionIndex: z.string(),
  type: z.string(),
});
export type EvmTxSequencer = z.infer<typeof zEvmTxSequencer>;

export const zEvmTxsResponseSequencer = z.object({
  pagination: zPagination,
  txs: z.array(zEvmTxSequencer),
});
export type EvmTxsResponseSequencer = z.infer<typeof zEvmTxsResponseSequencer>;

export type EvmTxResponseSequencerWithRpcData =
  EvmTxsResponseSequencer["txs"][number] &
    Pick<TxJsonRpc, "input" | "value"> & {
      timestamp: Date;
    };

export type EvmTxsResponseSequencerWithRpcData = Omit<
  EvmTxsResponseSequencer,
  "txs"
> & {
  txs: EvmTxResponseSequencerWithRpcData[];
};

export const zEvmTxResponseSequencer = z.object({
  tx: zEvmTxSequencer,
});
