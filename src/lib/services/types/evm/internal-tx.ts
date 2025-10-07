import { zHexAddr20, zHexBig, zPagination } from "lib/types";
import { snakeToCamel } from "lib/utils";
import { z } from "zod";

export const zEvmInternalTxSequencer = z
  .object({
    from: zHexAddr20,
    gas: zHexBig,
    gasUsed: zHexBig,
    hash: z.string(),
    height: z.number(),
    index: z.number(),
    input: z.string(),
    output: z.string(),
    parent_index: z.number(),
    to: zHexAddr20,
    type: z.string(),
    value: z.preprocess(
      (val) => (val === "0x" ? undefined : val),
      zHexBig.optional()
    ),
  })
  .transform(snakeToCamel);
export type EvmInternalTxSequencer = z.infer<typeof zEvmInternalTxSequencer>;

export const zEvmInternalTxsResponseSequencer = z
  .object({
    internal_txs: z.array(zEvmInternalTxSequencer),
    pagination: zPagination,
  })
  .transform(snakeToCamel);
export type EvmInternalTxsResponseSequencer = z.infer<
  typeof zEvmInternalTxsResponseSequencer
>;
