import type { CodeSchema } from "lib/types";
import { SchemaProperties } from "lib/types";
import executeSchemaOutput from "lib/utils/_suites/verification/wasm/execute-schema-output.json";
import querySchemaOutput from "lib/utils/_suites/verification/wasm/query-schema-output.json";

import { getExecuteSchema, getQuerySchema, getSchemaProperty } from "./wasm";
import {
  exampleCodeId,
  exampleSchema,
} from "../_suites/verification/wasm/example";

const randomSchema = {} as CodeSchema;

describe("getSchemaProperty", () => {
  test("correctly retrieve schema property", () => {
    expect(
      getSchemaProperty(exampleSchema, SchemaProperties.CONTRACT_NAME)
    ).toEqual(exampleSchema.contract_name);
    expect(
      getSchemaProperty(exampleSchema, SchemaProperties.CONTRACT_VERSION)
    ).toEqual(exampleSchema.contract_version);
    expect(
      getSchemaProperty(exampleSchema, SchemaProperties.IDL_VERSION)
    ).toEqual(exampleSchema.idl_version);
    expect(
      getSchemaProperty(exampleSchema, SchemaProperties.INSTANTIATE)
    ).toEqual(exampleSchema.instantiate);
    expect(getSchemaProperty(exampleSchema, SchemaProperties.EXECUTE)).toEqual(
      exampleSchema.execute
    );
    expect(getSchemaProperty(exampleSchema, SchemaProperties.QUERY)).toEqual(
      exampleSchema.query
    );
    expect(getSchemaProperty(exampleSchema, SchemaProperties.MIGRATE)).toEqual(
      exampleSchema.migrate
    );
    expect(getSchemaProperty(exampleSchema, SchemaProperties.SUDO)).toEqual(
      exampleSchema.sudo
    );
    expect(
      getSchemaProperty(exampleSchema, SchemaProperties.RESPONSES)
    ).toEqual(exampleSchema.responses);
    expect(
      getSchemaProperty(exampleSchema, SchemaProperties.ATTACHED_CODE_ID)
    ).toEqual(exampleCodeId);
  });

  test("correctly retrieve schema property from uppercase code hash", () => {
    expect(
      getSchemaProperty(exampleSchema, SchemaProperties.CONTRACT_NAME)
    ).toStrictEqual(exampleSchema.contract_name);
  });

  test("correctly return undefined on code hash not found", () => {
    expect(
      getSchemaProperty(randomSchema, SchemaProperties.CONTRACT_NAME)
    ).toBeUndefined();
  });
});

describe("getQuerySchemaFormArray", () => {
  test("correctly get form array for query schema", () => {
    expect(getQuerySchema(exampleSchema)).toEqual(querySchemaOutput);
    expect(getQuerySchema(exampleSchema)).toEqual(querySchemaOutput);
  });

  test("correctly get form array for query schema from uppercase code hash", () => {
    expect(getQuerySchema(exampleSchema)).toEqual(querySchemaOutput);
  });

  test("correctly return undefined for non-existent code hash", () => {
    expect(getQuerySchema(randomSchema)).toBeUndefined();
  });
});

describe("getExecuteSchemaFormArray", () => {
  test("correctly get form array for execute schema", () => {
    expect(getExecuteSchema(exampleSchema)).toEqual(executeSchemaOutput);
    expect(getExecuteSchema(exampleSchema)).toEqual(executeSchemaOutput);
  });
  test("correctly get form array for execute schema from uppercase code hash", () => {
    expect(getExecuteSchema(exampleSchema)).toEqual(executeSchemaOutput);
  });
  test("correctly return undefined for non-existent code hash", () => {
    expect(getExecuteSchema(randomSchema)).toBeUndefined();
  });
});
