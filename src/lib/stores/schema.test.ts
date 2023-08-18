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

beforeEach(() => {
  schemaStore.saveNewSchema(codeHash, exampleSchema);
});

describe("SchemaStore initialization", () => {
  test("Correctly initialize SchemaStore", () => {
    expect(schemaStore instanceof SchemaStore).toBeTruthy();
  });
});

describe("saveNewSchema and deleteSchema", () => {
  test("correctly save new schema and delete schema by codeHash", () => {
    expect(schemaStore.jsonSchemas).toStrictEqual({
      [codeHash]: exampleSchema,
    });
    schemaStore.deleteSchema(codeHash);
    expect(schemaStore.jsonSchemas[codeHash]).toBeUndefined();
  });
});

describe("getSchemaByCodeHash", () => {
  test("correctly get schema by code hash", () => {
    expect(schemaStore.getSchemaByCodeHash(codeHash)).toStrictEqual(
      exampleSchema
    );
  });
  test("correctly get schema by uppercase code hash", () => {
    expect(
      schemaStore.getSchemaByCodeHash(codeHash.toUpperCase())
    ).toStrictEqual(exampleSchema);
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

  test("correctly retrieve schema property from uppercase code hash", () => {
    expect(
      schemaStore.getSchemaProperty(
        codeHash.toUpperCase(),
        SchemaProperties.CONTRACT_NAME
      )
    ).toStrictEqual(exampleSchema.contract_name);
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
  test("correctly get form array for query schema", () => {
    expect(schemaStore.getQuerySchema(codeHash)).toEqual(querySchemaOutput);
  });

  test("correctly get form array for query schema from uppercase code hash", () => {
    expect(schemaStore.getQuerySchema(codeHash.toUpperCase())).toEqual(
      querySchemaOutput
    );
  });

  test("correctly return undefined for non-existent code hash", () => {
    expect(schemaStore.getQuerySchema("randomHash")).toBeUndefined();
  });
});

describe("getExecuteSchemaFormArray", () => {
  test("correctly get form array for execute schema", () => {
    expect(schemaStore.getExecuteSchema(codeHash)).toEqual(executeSchemaOutput);
  });
  test("correctly get form array for execute schema from uppercase code hash", () => {
    expect(schemaStore.getExecuteSchema(codeHash.toUpperCase())).toEqual(
      executeSchemaOutput
    );
  });
  test("correctly return undefined for non-existent code hash", () => {
    expect(schemaStore.getExecuteSchema("randomHash")).toBeUndefined();
  });
});
