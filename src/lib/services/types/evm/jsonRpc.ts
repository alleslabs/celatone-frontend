import { zJsonDataType } from "lib/types";
import { z } from "zod";

export const zJsonRpcResponse = z.object({
  error: z
    .object({
      code: z.number(),
      message: z.string(),
    })
    .optional(),
  id: z.union([z.string(), z.number()]),
  jsonrpc: z.literal("2.0"),
  result: zJsonDataType.optional(),
});
export type JsonRpcResponse = z.infer<typeof zJsonRpcResponse>;

export const zBatchJsonRpcResponse = z.array(zJsonRpcResponse);
export type BatchJsonRpcResponse = z.infer<typeof zBatchJsonRpcResponse>;
