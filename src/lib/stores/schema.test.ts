import type { CodeSchema } from "./schema";
import { SchemaProperties, SchemaStore } from "./schema";
import executeSchemaOutput from "./schema-test-suite/execute-schema-output.json";
import querySchemaOutput from "./schema-test-suite/query-schema-output.json";
import schema from "./schema-test-suite/schema-example.json";

let schemaStore: SchemaStore;
const exampleSchema = schema as unknown as CodeSchema;
const codeHash = "a1b2c3d4e5f6g7";

beforeAll(() => {
  schemaStore = new SchemaStore();
});

describe("SchemaStore initialization", () => {
  test("Correctly initialize SchemaStore", () => {
    expect(schemaStore instanceof SchemaStore).toBeTruthy();
  });
});

describe("saveNewSchema", () => {
  test("correctly save new schema", () => {
    schemaStore.saveNewSchema(codeHash, exampleSchema);
    expect(schemaStore.jsonSchemas).toStrictEqual({
      [codeHash]: exampleSchema,
    });
  });
});

describe("getSchemaByCodeHash", () => {
  test("correctly get schema by code hash", () => {
    expect(schemaStore.getSchemaByCodeHash(codeHash)).toStrictEqual(
      exampleSchema
    );
  });
  test("return undefined on code hash not found", () => {
    expect(schemaStore.getSchemaByCodeHash("randomHash")).toBeUndefined();
  });
});

describe("getSchemaProperty", () => {
  test("correctly retrieve schema property", () => {
    expect(
      schemaStore.getSchemaProperty(codeHash, SchemaProperties.CONTRACT_NAME)
    ).toStrictEqual(exampleSchema.contract_name);
    expect(
      schemaStore.getSchemaProperty(codeHash, SchemaProperties.CONTRACT_VERSION)
    ).toStrictEqual(exampleSchema.contract_version);
    expect(
      schemaStore.getSchemaProperty(codeHash, SchemaProperties.IDL_VERSION)
    ).toStrictEqual(exampleSchema.idl_version);
    expect(
      schemaStore.getSchemaProperty(codeHash, SchemaProperties.INSTANTIATE)
    ).toStrictEqual(exampleSchema.instantiate);
    expect(
      schemaStore.getSchemaProperty(codeHash, SchemaProperties.EXECUTE)
    ).toStrictEqual(exampleSchema.execute);
    expect(
      schemaStore.getSchemaProperty(codeHash, SchemaProperties.QUERY)
    ).toStrictEqual(exampleSchema.query);
    expect(
      schemaStore.getSchemaProperty(codeHash, SchemaProperties.MIGRATE)
    ).toStrictEqual(exampleSchema.migrate);
    expect(
      schemaStore.getSchemaProperty(codeHash, SchemaProperties.SUDO)
    ).toStrictEqual(exampleSchema.sudo);
    expect(
      schemaStore.getSchemaProperty(codeHash, SchemaProperties.RESPONSES)
    ).toStrictEqual(exampleSchema.responses);
  });

  test("correctly return undefined on code hash not found", () => {
    expect(
      schemaStore.getSchemaProperty(
        "randomHash",
        SchemaProperties.CONTRACT_NAME
      )
    ).toBeUndefined();
  });
});

describe("getQuerySchemaFormArray", () => {
  beforeAll(() => {
    schemaStore.saveNewSchema(codeHash, exampleSchema);
  });
  test("correctly get form array for query schema", () => {
    expect(schemaStore.getQuerySchema(codeHash)).toEqual(querySchemaOutput);
  });

  test("correctly return undefined for non-existent code hash", () => {
    expect(schemaStore.getQuerySchema("randomHash")).toBeUndefined();
  });
});

describe("getExecuteSchemaFormArray", () => {
  beforeAll(() => {
    schemaStore.saveNewSchema(codeHash, exampleSchema);
  });
  test("correctly get form array for execute schema", () => {
    expect(schemaStore.getExecuteSchema(codeHash)).toEqual(executeSchemaOutput);
  });
  test("correctly return undefined for non-existent code hash", () => {
    expect(schemaStore.getExecuteSchema("randomHash")).toBeUndefined();
  });
});
