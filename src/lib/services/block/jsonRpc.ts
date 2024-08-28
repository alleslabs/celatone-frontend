import { requestJsonRpc } from "../evm/jsonRpc";
import { zBlockJsonRpc } from "../types";
import { numberToHex, parseWithError } from "lib/utils";

export const getBlockDataJsonRpc = (endpoint: string, height: number) =>
  requestJsonRpc(endpoint, "eth_getBlockByNumber", [
    numberToHex(height),
    false,
  ]).then(({ result }) => parseWithError(zBlockJsonRpc, result));
