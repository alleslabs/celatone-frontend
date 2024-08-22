import { z } from "zod";

import { zHexAddr, zUtcDate } from "lib/types";
import { snakeToCamel } from "lib/utils";

export enum MoveVerifyTaskStatus {
  Finished = "FINISHED",
  NotFound = "NOT_FOUND",
  Pending = "PENDING",
  Running = "RUNNING",
}

export const zSubmitMoveVerifyResponse = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(MoveVerifyTaskStatus),
});
export type SubmitMoveVerifyResponse = z.infer<
  typeof zSubmitMoveVerifyResponse
>;

const zMoveVerificationModuleIdentifier = z.object({
  name: z.string(),
  address: zHexAddr,
});
export type MoveVerificationModuleIdentifier = z.infer<
  typeof zMoveVerificationModuleIdentifier
>;

export const zMoveVerifyByTaskIdResponse = z.object({
  task: z.object({
    id: z.string().uuid(),
    status: z.nativeEnum(MoveVerifyTaskStatus),
  }),
  result: z
    .object({
      moduleIdentifiers: z.array(zMoveVerificationModuleIdentifier),
      chainId: z.string(),
      verifiedAt: z.coerce.date(),
    })
    .nullable(),
});
export type MoveVerifyByTaskIdResponse = z.infer<
  typeof zMoveVerifyByTaskIdResponse
>;

export const zMoveVerifyInfoResponse = z
  .object({
    module_address: zHexAddr,
    module_name: z.string(),
    verified_at: zUtcDate,
    digest: z.string(),
    source: z.string(),
    base64: z.string(),
    chain_id: z.string(),
  })
  .transform(snakeToCamel);
export type MoveVerifyInfoResponse = z.infer<typeof zMoveVerifyInfoResponse>;

export const zMoveVerifyInfosByAddressResponse = z.object({
  contracts: z.array(
    zMoveVerifyInfoResponse.innerType().extend({
      id: z.string().uuid(),
    })
  ),
});
export type MoveVerifyInfosByAddressResponse = z.infer<
  typeof zMoveVerifyInfosByAddressResponse
>;
