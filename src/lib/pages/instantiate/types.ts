import type {
  jsonInputFormKey,
  yourSchemaInputFormKey,
} from "lib/components/json-schema";
import type { MsgInstantiateContract } from "lib/types";

import { isId } from "lib/utils";
import { z } from "zod";

export const zInstantiateQueryParams = z.object({
  codeId: z
    .string()
    .transform((val) => (isId(val) ? Number(val) : undefined))
    .optional(),
  msg: z.string().optional(),
});

export interface InstantiateFormState {
  codeId: string;
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
