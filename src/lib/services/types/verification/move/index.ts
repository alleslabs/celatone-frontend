import { z } from "zod";

import { zHexAddr } from "lib/types";
import { snakeToCamel } from "lib/utils";

enum MoveVerifyTaskStatus {
  Finished = "FINISHED",
  NotFound = "NOT_FOUND",
  Pending = "PENDING",
  Running = "RUNNING",
}

export const zMoveVerifyByTaskIdResponse = z.object({
  task: z.object({
    id: z.string(),
    status: z.nativeEnum(MoveVerifyTaskStatus),
  }),
  results: z.object({
    moduleIdentifiers: z.array(
      z.object({
        name: z.string(),
        address: zHexAddr,
      })
    ),
    chainId: z.string(),
    verifiedAt: z.coerce.date(),
  }),
});
export type MoveVerifyByTaskIdResponse = z.infer<
  typeof zMoveVerifyByTaskIdResponse
>;

export const zMoveVerifyInfoResponse = z
  .object({
    module_address: zHexAddr,
    module_name: z.string(),
    verified_at: z.string(),
    digest: z.string(),
    source: z.string(),
    base64: z.string(),
    chain_id: z.string(),
  })
  .transform(snakeToCamel);
export type MoveVerifyInfoResponse = z.infer<typeof zMoveVerifyInfoResponse>;

export const zMoveVerifyInfosByModuleResponse = z.object({
  contracts: z.array(
    zMoveVerifyInfoResponse.innerType().extend({
      id: z.string(),
    })
  ),
});
export type MoveVerifyInfosByModuleResponse = z.infer<
  typeof zMoveVerifyInfosByModuleResponse
>;
