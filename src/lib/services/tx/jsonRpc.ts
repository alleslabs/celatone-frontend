import { z } from "zod";

import { TransactionRequest } from "ethers";
import { parseWithError } from "lib/utils";
import type { JsonRpcParams } from "../evm/jsonRpc";
import { requestBatchJsonRpc, requestJsonRpc } from "../evm/jsonRpc";
import {
  zEvmTxHashByCosmosTxHashJsonRpc,
  zEvmTxHashesByCosmosTxHashesJsonRpc,
  zSimulateFeeEvm,
  zTxDataJsonRpc,
  zTxsDataJsonRpc,
} from "../types";

export const getEvmTxHashByCosmosTxHash = async (
  endpoint: string,
  cosmosTxHash: string
) =>
  requestJsonRpc(endpoint, "cosmos_txHashByCosmosTxHash", [cosmosTxHash]).then(
    (result) => parseWithError(zEvmTxHashByCosmosTxHashJsonRpc, result)
  );

export const getEvmTxHashesByCosmosTxHashes = async (
  endpoint: string,
  cosmosTxHashes: string[]
) =>
  requestBatchJsonRpc(
    endpoint,
    cosmosTxHashes.map((hash) => ({
      method: "cosmos_txHashByCosmosTxHash",
      params: [hash],
    }))
  ).then((results) =>
    parseWithError(zEvmTxHashesByCosmosTxHashesJsonRpc, results)
  );

export const getTxDataJsonRpc = async (endpoint: string, evmTxHash: string) =>
  requestBatchJsonRpc(endpoint, [
    {
      method: "eth_getTransactionByHash",
      params: [evmTxHash],
    },
    {
      method: "eth_getTransactionReceipt",
      params: [evmTxHash],
    },
  ]).then((results) => parseWithError(zTxDataJsonRpc, results));

export const getTxsDataJsonRpc = async (
  endpoint: string,
  evmTxHashes: string[]
) => {
  const requests: {
    method: string;
    params: JsonRpcParams[];
  }[] = [];

  evmTxHashes.forEach((hash) => {
    requests.push({
      method: "eth_getTransactionByHash",
      params: [hash],
    });

    requests.push({
      method: "eth_getTransactionReceipt",
      params: [hash],
    });
  });

  return requestBatchJsonRpc(endpoint, requests).then((results) => {
    const parsedResults = [];

    for (let i = 0; i < results.length; i += 2) {
      const result = results.slice(i, i + 2);
      parsedResults.push(result);
    }

    return parseWithError(zTxsDataJsonRpc, parsedResults);
  });
};
export const getCosmosTxHashByEvmTxHash = (
  endpoint: string,
  evmTxHash: string
) =>
  requestJsonRpc(endpoint, "cosmos_cosmosTxHashByTxHash", [evmTxHash]).then(
    (result) => parseWithError(z.string(), result)
  );

export const getSimulateFeeEvm = (
  endpoint: string,
  request: TransactionRequest
) =>
  requestBatchJsonRpc(endpoint, [
    {
      method: "eth_gasPrice",
      params: [],
    },
    {
      method: "eth_estimateGas",
      params: [request],
    },
  ]).then((results) => parseWithError(zSimulateFeeEvm, results));
