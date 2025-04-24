import { zHexAddr, zUtcDate } from "lib/types";
import { mergeModulePath, snakeToCamel } from "lib/utils";
import { z } from "zod";

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
  info: z
    .object({
      bytecode_version: z.number(),
      compiler_version: z.string(),
      language_version: z.string(),
    })
    .nullable()
    .transform((val) => (val ? snakeToCamel(val) : null)),
  result: z
    .object({
      chain_id: z.string(),
      module_identifiers: z.array(zMoveVerificationModuleIdentifier),
      verified_at: z.coerce.date(),
    })
    .optional()
    .transform((val) => (val ? snakeToCamel(val) : undefined)),
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
    bytecode_version: z.number(),
    chain_id: z.string(),
    compiler_version: z.string(),
    digest: z.string(),
    language_version: z.string(),
    module_address: zHexAddr,
    module_name: z.string(),
    source: z.string(),
    toml: z.string(),
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
        // eslint-disable-next-line no-param-reassign
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
