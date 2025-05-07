import type { TransactionRequest } from "ethers";

import { parseWithError } from "lib/utils";
import { z } from "zod";

import type { JsonRpcParams } from "../evm/json-rpc";

import { requestBatchJsonRpc, requestJsonRpc } from "../evm/json-rpc";
import {
  zEvmTxHashByCosmosTxHashJsonRpc,
  zEvmTxHashesByCosmosTxHashesJsonRpc,
  zSimulateFeeEvm,
  zTxDataJsonRpc,
  zTxsDataJsonRpc,
} from "../types";
import { queryWithArchivalFallback } from "../utils";

export const getEvmTxHashByCosmosTxHash = async (
  endpoint: string,
  cosmosTxHash: string
) =>
  requestJsonRpc(endpoint, "cosmos_txHashByCosmosTxHash", [cosmosTxHash]).then(
    (result) => parseWithError(zEvmTxHashByCosmosTxHashJsonRpc, result)
  );

export const getEvmTxHashesByCosmosTxHashes = (
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

export const getTxDataJsonRpc = async (endpoint: string, evmTxHash: string) => {
  const fetch = async (endpoint: string) => {
    const result = await requestBatchJsonRpc(endpoint, [
      {
        method: "eth_getTransactionByHash",
        params: [evmTxHash],
      },
      {
        method: "eth_getTransactionReceipt",
        params: [evmTxHash],
      },
    ]);

    // If tx or tx receipt is null, then this will throw an error
    return parseWithError(zTxDataJsonRpc, result);
  };

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getTxsDataJsonRpc = (endpoint: string, evmTxHashes: string[]) => {
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
) => {
  const fetch = async (endpoint: string, throwErrorIfNoData: boolean) => {
    const result = await requestJsonRpc(
      endpoint,
      "cosmos_cosmosTxHashByTxHash",
      [evmTxHash]
    );
    const parsed = parseWithError(z.string(), result);

    if (
      throwErrorIfNoData &&
      parsed ===
        "0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      throw new Error("No data found");
    }

    return parsed;
  };

  return queryWithArchivalFallback(endpoint, fetch);
};

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
