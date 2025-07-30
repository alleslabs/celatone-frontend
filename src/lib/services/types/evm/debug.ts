import type Big from "big.js";
import type { HexAddr20 } from "lib/types";
import type { ZodType, ZodTypeDef } from "zod";

import { zHexAddr20, zHexBig } from "lib/types";
import { z } from "zod";

type EvmCallFrameInput = {
  calls?: EvmCallFrameInput[];
  from: string;
  gas: string;
  gasUsed: string;
  input: string;
  output?: string;
  to: string;
  type: string;
  value?: string;
};

export interface EvmCallFrame {
  calls?: EvmCallFrame[];
  from: HexAddr20;
  gas: Big;
  gasUsed: Big;
  input: string;
  output?: string;
  to: HexAddr20;
  type: string;
  value?: Big;
}

export const zEvmCallFrame: ZodType<
  EvmCallFrame,
  ZodTypeDef,
  EvmCallFrameInput
> = z.object({
  calls: z.lazy(() => zEvmCallFrame.array()).optional(),
  from: zHexAddr20,
  gas: zHexBig,
  gasUsed: zHexBig,
  input: z.string(),
  output: z.string().optional(),
  to: zHexAddr20,
  type: z.string(),
  value: zHexBig.optional(),
});

export const zEvmDebugTraceResponse = z
  .object({
    result: zEvmCallFrame,
    txHash: z.string(),
  })
  .array();
export type EvmDebugTraceResponse = z.infer<typeof zEvmDebugTraceResponse>;
