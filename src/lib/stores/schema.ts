import type { RJSFSchema as JsonSchema } from "@rjsf/utils";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import type { Dict, Option } from "lib/types";

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

interface QueryExecuteSchema {
  title: Option<string>;
  description: Option<string>;
  schema: JsonSchema;
}

export interface CodeSchema {
  [SchemaProperties.CONTRACT_NAME]: string;
  [SchemaProperties.CONTRACT_VERSION]: string;
  [SchemaProperties.IDL_VERSION]: string;
  [SchemaProperties.INSTANTIATE]: JsonSchema;
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

  getQuerySchema(
    codeHash: string
  ): Option<Array<[QueryExecuteSchema, JsonSchema]>> {
    const querySchema = this.getSchemaProperty(
      codeHash,
      SchemaProperties.QUERY
    );

    const responsesSchema = this.getSchemaProperty(
      codeHash,
      SchemaProperties.RESPONSES
    );

    if (!querySchema || !responsesSchema) return undefined;

    return querySchema.oneOf?.reduce<Array<[QueryExecuteSchema, JsonSchema]>>(
      (acc, msg) => {
        const eachQuerySchema = msg as JsonSchema;
        const { required } = eachQuerySchema;

        if (required) {
          const desc1 = eachQuerySchema.description;

          delete eachQuerySchema.description;

          return [
            ...acc,
            [
              {
                title: required[0],
                description: desc1,
                schema: {
                  ...eachQuerySchema,
                  $schema: querySchema.$schema,
                  definitions: querySchema.definitions,
                },
              },
              {
                ...responsesSchema[required[0]],
                readOnly: true,
              },
            ],
          ];
        }

        return acc;
      },
      []
    );
  }

  getExecuteSchema(codeHash: string): Option<Array<QueryExecuteSchema>> {
    const executeSchema = this.getSchemaProperty(
      codeHash,
      SchemaProperties.EXECUTE
    );

    if (!executeSchema) return undefined;

    return executeSchema.oneOf?.map<QueryExecuteSchema>((msg) => {
      const eachSchema = msg as JsonSchema;
      const { required, description } = eachSchema;

      delete eachSchema.description;

      return {
        title: required?.[0],
        description,
        schema: {
          ...eachSchema,
          $schema: executeSchema.$schema,
          definitions: executeSchema.definitions,
        },
      };
    });
  }
}
