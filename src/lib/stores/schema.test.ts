import type { CodeSchema } from "lib/types";
import {
  exampleCodeHash,
  exampleCodeId,
  exampleSchema,
} from "lib/utils/_suites/verification/wasm/example";
import schema from "lib/utils/_suites/verification/wasm/schema-example.json";

import { SchemaStore } from "./schema";

let schemaStore: SchemaStore;

beforeAll(() => {
  schemaStore = new SchemaStore();
});

beforeEach(() => {
  schemaStore.saveNewSchema(
    exampleCodeHash,
    exampleCodeId,
    JSON.parse(JSON.stringify(schema)) as CodeSchema
  );
});

describe("SchemaStore initialization", () => {
  test("Correctly initialize SchemaStore", () => {
    expect(schemaStore instanceof SchemaStore).toBeTruthy();
  });
});

describe("saveNewSchema and deleteSchema", () => {
  test("correctly save new schema and delete schema by codeHash", () => {
    expect(schemaStore.jsonSchemas).toEqual({
      [exampleCodeHash]: exampleSchema,
    });
    schemaStore.deleteSchema(exampleCodeHash);
    expect(schemaStore.jsonSchemas[exampleCodeHash]).toBeUndefined();
  });
});

describe("getSchemaByCodeHash", () => {
  test("correctly get schema by code hash", () => {
    expect(schemaStore.getSchemaByCodeHash(exampleCodeHash)).toEqual(
      exampleSchema
    );
  });
  test("correctly get schema by uppercase code hash", () => {
    expect(
      schemaStore.getSchemaByCodeHash(exampleCodeHash.toUpperCase())
    ).toEqual(exampleSchema);
  });
  test("return undefined on code hash not found", () => {
    expect(schemaStore.getSchemaByCodeHash("randomHash")).toBeUndefined();
  });
});
