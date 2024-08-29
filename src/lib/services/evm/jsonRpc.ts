import axios from "axios";
import * as uuid from "uuid";

import type { JsonRpcResponse } from "../types/evm";
import { zBatchJsonRpcResponse, zJsonRpcResponse } from "../types/evm";
import { parseWithError } from "lib/utils";

type JsonRpcParams = string | boolean;

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

      return parsed;
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
      if (!Array.isArray(parsed)) {
        throw new Error(parsed.error.message);
      }

      const parsedResults = new Array<JsonRpcResponse["result"]>(
        requests.length
      );
      parsed.forEach((result) => {
        if (typeof result.id === "number")
          parsedResults[result.id] = result.result;
      });

      return parsedResults;
    });
