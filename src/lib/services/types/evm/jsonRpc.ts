import { z } from "zod";

import { zJsonDataType } from "lib/types";

export const zJsonRpcResponse = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number()]),
  result: zJsonDataType.optional(),
  error: z
    .object({
      code: z.number(),
      message: z.string(),
    })
    .optional(),
});
export type JsonRpcResponse = z.infer<typeof zJsonRpcResponse>;

export const zBatchJsonRpcResponse = z.array(zJsonRpcResponse);
export type BatchJsonRpcResponse = z.infer<typeof zBatchJsonRpcResponse>;
