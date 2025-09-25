import { numberToHex, parseWithError } from "lib/utils";

import type { JsonRpcParams } from "../evm/json-rpc";

import { requestBatchJsonRpc } from "../evm/json-rpc";
import { zBlockDataJsonRpc } from "../types";
import { queryWithArchivalFallback } from "../utils";

export const getBlockDataJsonRpc = async (endpoint: string, height: number) => {
  const fetch = async (endpoint: string) => {
    const result = await requestBatchJsonRpc(endpoint, [
      {
        method: "eth_getBlockByNumber",
        params: [numberToHex(height), true],
      },
      {
        method: "eth_getBlockReceipts",
        params: [numberToHex(height)],
      },
    ]);

    // If block is null, then this will throw an error
    return parseWithError(zBlockDataJsonRpc, result);
  };

  return queryWithArchivalFallback(endpoint, fetch);
};

export const getBlockDataJsonRpcByBlockNumbers = async (
  endpoint: string,
  blockNumbers: string[]
) => {
  const requests: {
    method: string;
    params: JsonRpcParams[];
  }[] = [];

  blockNumbers.forEach((blockNumber) => {
    requests.push({
      method: "eth_getBlockByNumber",
      params: [blockNumber, true],
    });

    requests.push({
      method: "eth_getBlockReceipts",
      params: [blockNumber],
    });
  });

  const fetch = async (endpoint: string) => {
    const results = await requestBatchJsonRpc(endpoint, requests);

    const parsedResults = [];

    for (let i = 0; i < results.length; i += 2) {
      const result = results.slice(i, i + 2);
      parsedResults.push(result);
    }

    return parseWithError(zBlockDataJsonRpc.array(), parsedResults);
  };

  return queryWithArchivalFallback(endpoint, fetch);
};
