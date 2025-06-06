import axios from "axios";
import { parseWithError } from "lib/utils";
import * as uuid from "uuid";

import type { JsonRpcResponse } from "../../types/evm";

import { zBatchJsonRpcResponse, zJsonRpcResponse } from "../../types/evm";

export type JsonRpcParams = boolean | object | string;

export const requestJsonRpc = (
  endpoint: string,
  method: string,
  params: JsonRpcParams[]
) =>
  axios
    .post(
      endpoint,
      {
        id: uuid.v4(),
        jsonrpc: "2.0",
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
        id: index,
        jsonrpc: "2.0",
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
        if (result.error) throw new Error(result.error.message);
        if (typeof result.id === "number")
          parsedResults[result.id] = result.result;
      });

      return parsedResults;
    });
