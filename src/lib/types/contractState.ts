import { z } from "zod";

const zSingleton = z.object({
  type: z.literal("singleton"),
  value: z.string(),
});

const zBucket = z.object({
  type: z.literal("bucket"),
  values: z.string().array(),
});

const zDecodedKey = z.union([zSingleton, zBucket]);
export type DecodedKey = z.infer<typeof zDecodedKey>;

export const zContractState = z.object({
  rawKey: z.string(),
  key: zDecodedKey,
  value: z.unknown(),
});
export type ContractState = z.infer<typeof zContractState>;
