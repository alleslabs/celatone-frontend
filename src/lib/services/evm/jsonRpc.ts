import axios from "axios";
import * as uuid from "uuid";

import { zJsonRpcResponse } from "../types/evm";
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
