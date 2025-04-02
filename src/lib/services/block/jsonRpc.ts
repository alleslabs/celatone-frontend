import { numberToHex, parseWithError } from "lib/utils";

import { requestBatchJsonRpc } from "../evm/json-rpc";
import { zBlockDataJsonRpc } from "../types";

export const getBlockDataJsonRpc = (endpoint: string, height: number) =>
  requestBatchJsonRpc(endpoint, [
    {
      method: "eth_getBlockByNumber",
      params: [numberToHex(height), true],
    },
    {
      method: "eth_getBlockReceipts",
      params: [numberToHex(height)],
    },
  ]).then((results) => parseWithError(zBlockDataJsonRpc, results));
