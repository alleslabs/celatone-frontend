import { z } from "zod";

import { requestBatchJsonRpc, requestJsonRpc } from "../evm/jsonRpc";
import {
  zEvmTxHashByCosmosTxHashJsonRpc,
  zTxJsonRpc,
  zTxReceiptJsonRpc,
} from "../types";
import { parseWithError } from "lib/utils";

export const getEvmTxHashByCosmosTxHash = (
  endpoint: string,
  cosmosTxHash: string
) =>
  requestJsonRpc(endpoint, "cosmos_txHashByCosmosTxHash", [cosmosTxHash]).then(
    ({ result }) => parseWithError(zEvmTxHashByCosmosTxHashJsonRpc, result)
  );

export const getTxDataJsonRpc = (endpoint: string, evmTxHash: string) =>
  requestBatchJsonRpc(endpoint, [
    {
      method: "eth_getTransactionByHash",
      params: [evmTxHash],
    },
    {
      method: "eth_getTransactionReceipt",
      params: [evmTxHash],
    },
  ]).then((results) =>
    parseWithError(z.tuple([zTxJsonRpc, zTxReceiptJsonRpc]), results)
  );
