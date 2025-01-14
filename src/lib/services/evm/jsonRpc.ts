import axios from "axios";
import * as uuid from "uuid";

import type { JsonRpcResponse } from "../types/evm";
import { zBatchJsonRpcResponse, zJsonRpcResponse } from "../types/evm";
import { parseWithError } from "lib/utils";
import { HexAddr20, Nullable, zHex } from "lib/types";

export type JsonRpcParams = object | string | boolean;

export const requestJsonRpc = (
  endpoint: string,
  method: string,
  params: JsonRpcParams[]
) =>
  axios
    .post(
      endpoint,
      {
        jsonrpc: "2.0",
        id: uuid.v4(),
        method,
        params,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(({ data }) => {
      const parsed = parseWithError(zJsonRpcResponse, data);
      if (parsed.error) {
        throw new Error(parsed.error.message);
      }

      return parsed.result;
    });

export const requestBatchJsonRpc = (
  endpoint: string,
  requests: {
    method: string;
    params: JsonRpcParams[];
  }[]
) =>
  axios
    .post(
      endpoint,
      requests.map(({ method, params }, index) => ({
        jsonrpc: "2.0",
        id: index,
        method,
        params,
      })),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(({ data }) => {
      const parsed = parseWithError(zBatchJsonRpcResponse, data);

      const parsedResults = new Array<JsonRpcResponse["result"]>(
        requests.length
      );
      parsed.forEach((result) => {
        if (typeof result.id === "number")
          parsedResults[result.id] = result.result;
      });

      return parsedResults;
    });

export const getEthCall = (
  endpoint: string,
  from: Nullable<HexAddr20>,
  to: HexAddr20,
  data: string
) =>
  requestJsonRpc(endpoint, "eth_call", [{ from, to, data }, "latest"]).then(
    (result) => parseWithError(zHex, result)
  );
