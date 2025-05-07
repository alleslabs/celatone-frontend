import { numberToHex, parseWithError } from "lib/utils";

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
