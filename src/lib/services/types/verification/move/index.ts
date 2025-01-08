import { z } from "zod";

import { zHexAddr, zUtcDate } from "lib/types";
import { mergeModulePath, snakeToCamel } from "lib/utils";

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
  address: zHexAddr,
  name: z.string(),
});
export type MoveVerificationModuleIdentifier = z.infer<
  typeof zMoveVerificationModuleIdentifier
>;

export const zMoveVerifyByTaskIdResponse = z.object({
  result: z
    .object({
      chainId: z.string(),
      moduleIdentifiers: z.array(zMoveVerificationModuleIdentifier),
      verifiedAt: z.coerce.date(),
    })
    .nullable(),
  task: z.object({
    id: z.string().uuid(),
    status: z.nativeEnum(MoveVerifyTaskStatus),
  }),
});
export type MoveVerifyByTaskIdResponse = z.infer<
  typeof zMoveVerifyByTaskIdResponse
>;

export const zMoveVerifyInfoResponse = z
  .object({
    base64: z.string(),
    chain_id: z.string(),
    digest: z.string(),
    module_address: zHexAddr,
    module_name: z.string(),
    source: z.string(),
    verified_at: zUtcDate,
  })
  .transform(snakeToCamel);
export type MoveVerifyInfoResponse = z.infer<typeof zMoveVerifyInfoResponse>;

export const zMoveVerifyInfosByAddressResponse = z
  .object({
    contracts: z.array(zMoveVerifyInfoResponse),
  })
  .transform((val) =>
    val.contracts.reduce<Record<string, MoveVerifyInfoResponse>>(
      (acc, contract) => {
        acc[mergeModulePath(contract.moduleAddress, contract.moduleName)] =
          contract;
        return acc;
      },
      {}
    )
  );
export type MoveVerifyInfosByAddressResponse = z.infer<
  typeof zMoveVerifyInfosByAddressResponse
>;
