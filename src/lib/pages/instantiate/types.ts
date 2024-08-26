import type {
  jsonInputFormKey,
  yourSchemaInputFormKey,
} from "lib/components/json-schema";
import type { MsgInstantiateContract } from "lib/types";

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
