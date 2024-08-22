import { z } from "zod";

import type { MsgInstantiateContract } from "lib/types";
import { isId } from "lib/utils";

export const zInstantiateQueryParams = z.object({
  msg: z.string().optional(),
  codeId: z
    .string()
    .transform((val) => (isId(val) ? Number(val) : undefined))
    .optional(),
});

export interface InstantiateRedoMsg
  extends Omit<MsgInstantiateContract, "codeId" | "msg"> {
  code_id: number;
  msg: object;
}
