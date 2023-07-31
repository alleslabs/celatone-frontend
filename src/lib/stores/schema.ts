import type { RJSFSchema as JsonSchema } from "@rjsf/utils";
import type { JSONSchema7 } from "json-schema";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import type { Dict, Option } from "lib/types";

// TODO: this is derived from an example schema, ensure that the properties are comprehensively defined
export enum SchemaProperties {
  CONTRACT_NAME = "contract_name",
  CONTRACT_VERSION = "contract_version",
  IDL_VERSION = "idl_version",
  INSTANTIATE = "instantiate",
  EXECUTE = "execute",
  QUERY = "query",
  MIGRATE = "migrate",
  SUDO = "sudo",
  RESPONSES = "responses",
}

type NullableJsonSchema = JsonSchema | null;

export interface CodeSchema {
  [SchemaProperties.CONTRACT_NAME]: string;
  [SchemaProperties.CONTRACT_VERSION]: string;
  [SchemaProperties.IDL_VERSION]: string;
  [SchemaProperties.INSTANTIATE]: NonNullable<JsonSchema>;
  [SchemaProperties.EXECUTE]: NullableJsonSchema;
  [SchemaProperties.QUERY]: NullableJsonSchema;
  [SchemaProperties.MIGRATE]: NullableJsonSchema;
  [SchemaProperties.SUDO]: NullableJsonSchema;
  [SchemaProperties.RESPONSES]: { [key: string]: JsonSchema };
}

export class SchemaStore {
  /**
   * @remarks code hash as key and json schema as value (annotated as Dict<string, unknown>>)
   * e.g.
   * {
   *   "ad5b2af9a177ffc": {
   *        "contract_name": ...,
   *        "instantiate": { ... },
   *        ...
   *      }
   * }
   */
  jsonSchemas: Dict<string, CodeSchema>;

  constructor() {
    this.jsonSchemas = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "SchemaStore",
      properties: ["jsonSchemas"],
    });
  }

  saveNewSchema(codeHash: string, schema: CodeSchema) {
    this.jsonSchemas[codeHash] = schema;
  }

  getSchemaByCodeHash(codeHash: string): Option<CodeSchema> {
    return this.jsonSchemas[codeHash];
  }

  getSchemaProperty<T extends SchemaProperties>(codeHash: string, property: T) {
    return this.jsonSchemas[codeHash]?.[property];
  }

  getQuerySchema(codeHash: string): Option<Array<[JSONSchema7, JsonSchema]>> {
    const responsesSchema = this.getSchemaProperty(
      codeHash,
      SchemaProperties.RESPONSES
    );
    const querySchema = this.getSchemaProperty(
      codeHash,
      SchemaProperties.QUERY
    );

    if (!querySchema || !responsesSchema) return undefined;

    return querySchema.oneOf
      ?.map((msg) => {
        const schema7 = msg as JSONSchema7;
        const { required } = schema7;
        return (
          required !== undefined && [
            {
              ...schema7,
              $schema: querySchema.$schema,
              definitions: querySchema.definitions,
            },
            {
              ...responsesSchema[required[0]],
              readOnly: true,
            },
          ]
        );
      })
      .filter((tuple) => Boolean(tuple)) as Array<[JSONSchema7, JsonSchema]>;
  }

  getExecuteSchema(codeHash: string): Option<Array<JSONSchema7>> {
    const executeSchema = this.getSchemaProperty(
      codeHash,
      SchemaProperties.EXECUTE
    );

    if (!executeSchema) return undefined;

    return executeSchema.oneOf?.map((msg) => ({
      ...(msg as JSONSchema7),
      $schema: executeSchema.$schema,
      definitions: executeSchema.definitions,
    }));
  }
}
