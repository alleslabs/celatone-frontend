import { requestJsonRpc } from "../evm/jsonRpc";
import { zEvmTxHashByCosmosTxHashJsonRpc, zTxJsonRpc } from "../types";
import { parseWithError } from "lib/utils";

export const getEvmTxHashByCosmosTxHash = (
  endpoint: string,
  cosmosTxHash: string
) =>
  requestJsonRpc(endpoint, "cosmos_txHashByCosmosTxHash", [cosmosTxHash]).then(
    ({ result }) => parseWithError(zEvmTxHashByCosmosTxHashJsonRpc, result)
  );

export const getTxDataJsonRpc = (endpoint: string, evmTxHash: string) =>
  requestJsonRpc(endpoint, "eth_getTransactionByHash", [evmTxHash]).then(
    ({ result }) => parseWithError(zTxJsonRpc, result)
  );
