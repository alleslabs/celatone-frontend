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
  ATTACHED_CODE_ID = "attached_code_id",
}

type NullableJsonSchema = JsonSchema | null;

export interface QueryExecuteSchema {
  title: Option<string>;
  description: Option<string>;
  schema: JsonSchema;
  inputRequired?: boolean;
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
  [SchemaProperties.ATTACHED_CODE_ID]: string;
}

export type QuerySchema = Array<[QueryExecuteSchema, JsonSchema]>;

export type ExecuteSchema = Array<QueryExecuteSchema>;

const normalize = (codeHash: string) => {
  return codeHash.toLowerCase();
};

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

  saveNewSchema(codeHash: string, codeId: string, schema: CodeSchema) {
    this.jsonSchemas[normalize(codeHash)] = {
      ...schema,
      [SchemaProperties.ATTACHED_CODE_ID]: codeId,
    };
  }

  deleteSchema(codeHash: string) {
    delete this.jsonSchemas[normalize(codeHash)];
  }

  getSchemaByCodeHash(codeHash: string): Option<CodeSchema> {
    return this.jsonSchemas[normalize(codeHash)];
  }

  getSchemaProperty<T extends SchemaProperties>(codeHash: string, property: T) {
    return this.jsonSchemas[normalize(codeHash)]?.[property];
  }

  getQuerySchema(codeHash: string): Option<QuerySchema> {
    const querySchema = this.getSchemaProperty(
      normalize(codeHash),
      SchemaProperties.QUERY
    );

    const responsesSchema = this.getSchemaProperty(
      normalize(codeHash),
      SchemaProperties.RESPONSES
    );

    if (!querySchema || !responsesSchema) return undefined;

    return querySchema.oneOf?.reduce<Array<[QueryExecuteSchema, JsonSchema]>>(
      (acc, msg) => {
        const eachQuerySchema = msg as JsonSchema;
        const { type, enum: enumOptions, required } = eachQuerySchema;
        if (type === "string" && enumOptions) {
          return [
            ...acc,
            ...enumOptions.map<[QueryExecuteSchema, JsonSchema]>(
              (enumOption) => [
                {
                  title: enumOption as string,
                  description: eachQuerySchema.description,
                  schema: {
                    $schema: querySchema.$schema,
                    type,
                    enum: [enumOption],
                  },
                  inputRequired: false,
                },
                {
                  ...responsesSchema[enumOption as string],
                  readOnly: true,
                },
              ]
            ),
          ];
        }
        if (required) {
          const { description, ...msgSchema } = eachQuerySchema;

          const title = required[0];
          const propertyKey = eachQuerySchema.properties?.[title] as JsonSchema;
          const noInputRequired =
            propertyKey.type === "object" && !("properties" in propertyKey);

          return [
            ...acc,
            [
              {
                title,
                description,
                schema: {
                  ...msgSchema,
                  $schema: querySchema.$schema,
                  definitions: querySchema.definitions,
                },
                inputRequired: !noInputRequired,
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

  getExecuteSchema(codeHash: string): Option<ExecuteSchema> {
    const executeSchema = this.getSchemaProperty(
      normalize(codeHash),
      SchemaProperties.EXECUTE
    );

    if (!executeSchema) return undefined;

    return executeSchema.oneOf?.reduce<Array<QueryExecuteSchema>>(
      (acc, msg) => {
        const eachExecuteSchema = msg as JsonSchema;
        const { type, required, enum: enumOptions } = eachExecuteSchema;
        const { description, ...msgSchema } = eachExecuteSchema;

        if (type === "string" && enumOptions) {
          return [
            ...acc,
            ...enumOptions.map<QueryExecuteSchema>((enumOption) => ({
              title: enumOption as string,
              description: eachExecuteSchema.description,
              schema: {
                $schema: eachExecuteSchema.$schema,
                type,
                enum: [enumOption],
              },
            })),
          ];
        }
        return [
          ...acc,
          {
            title: required?.[0],
            description,
            schema: {
              ...msgSchema,
              $schema: executeSchema.$schema,
              definitions: executeSchema.definitions,
            },
          },
        ];
      },
      []
    );
  }
}
