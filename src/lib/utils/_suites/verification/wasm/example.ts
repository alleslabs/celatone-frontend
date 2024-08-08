import type { CodeSchema } from "lib/types";
import { SchemaProperties } from "lib/types";

import schema from "./schema-example.json";

export const exampleCodeHash = "a1b2c3d4e5f6g7";
export const exampleCodeId = "1234";
export const exampleSchema = {
  ...schema,
  [SchemaProperties.ATTACHED_CODE_ID]: exampleCodeId,
} as unknown as CodeSchema;
