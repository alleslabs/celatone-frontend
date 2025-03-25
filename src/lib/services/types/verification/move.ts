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
      module_identifiers: z.array(zMoveVerificationModuleIdentifier),
      chain_id: z.string(),
      verified_at: z.coerce.date(),
    })
    .optional()
    .transform((val) => (val ? snakeToCamel(val) : undefined)),
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
    language_version: z.string(),
    bytecode_version: z.number(),
    compiler_version: z.string(),
    toml: z.string(),
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
