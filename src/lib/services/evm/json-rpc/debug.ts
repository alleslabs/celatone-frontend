import { zEvmCallFrame, zEvmDebugTraceResponse } from "lib/services/types";
import { numberToHex, parseWithError } from "lib/utils";

import { requestJsonRpc } from ".";

export const getDebugTraceTransaction = (endpoint: string, txHash: string) =>
  requestJsonRpc(endpoint, "debug_traceTransaction", [
    txHash,
    {
      tracer: "callTracer",
    },
  ]).then((result) => parseWithError(zEvmCallFrame, result));

export const getDebugTraceBlockByNumber = (endpoint: string, height: number) =>
  requestJsonRpc(endpoint, "debug_traceBlockByNumber", [
    numberToHex(height),
    {
      tracer: "callTracer",
    },
  ]).then((result) => parseWithError(zEvmDebugTraceResponse, result));
