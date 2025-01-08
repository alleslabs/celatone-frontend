import { z } from "zod";

import type {
  jsonInputFormKey,
  yourSchemaInputFormKey,
} from "lib/components/json-schema";
import type { MsgInstantiateContract } from "lib/types";
import { isId } from "lib/utils";

export const zInstantiateQueryParams = z.object({
  msg: z.string().optional(),
  codeId: z
    .string()
    .transform((val) => (isId(val) ? Number(val) : undefined))
    .optional(),
});

export interface InstantiateFormState {
  codeId: number;
  codeHash: string;
  label: string;
  adminAddress: string;
  msgInput: {
    [jsonInputFormKey]: string;
    [yourSchemaInputFormKey]: string;
  };
  simulateError: string;
}

export interface InstantiateRedoMsg
  extends Omit<MsgInstantiateContract, "codeId" | "msg"> {
  code_id: number;
  msg: object;
}
