import type { RJSFSchema as JsonSchema } from "@rjsf/utils";

import { SchemaProperties, WasmVerifyStatus } from "lib/types";
import type {
  CodeSchema,
  ExecuteSchema,
  Nullish,
  Option,
  QuerySchema,
  SchemaInfo,
  WasmVerifyInfo,
} from "lib/types";

// ------------------------------------------//
// ------------------SCHEMA------------------//
// ------------------------------------------//

const getResponseSchema = (responseSchema: JsonSchema): SchemaInfo => {
  const { description, title, ...resSchema } = responseSchema;
  return {
    description,
    schema: {
      ...resSchema,
      readOnly: true,
    },
    title,
  };
};

export const getSchemaProperty = <T extends SchemaProperties>(
  schema: Nullish<CodeSchema>,
  property: T
) => {
  return schema?.[property];
};

export const getQuerySchema = (
  schema: Nullish<CodeSchema>
): Option<QuerySchema> => {
  const querySchema = getSchemaProperty(schema, SchemaProperties.QUERY);
  const responsesSchema = getSchemaProperty(schema, SchemaProperties.RESPONSES);

  if (!querySchema || !responsesSchema) return undefined;

  return querySchema.oneOf?.reduce<Array<[SchemaInfo, SchemaInfo]>>(
    (acc, msg) => {
      const eachQuerySchema = msg as JsonSchema;
      const { enum: enumOptions, required, type } = eachQuerySchema;
      if (type === "string" && enumOptions) {
        return [
          ...acc,
          ...enumOptions.map<[SchemaInfo, SchemaInfo]>((enumOption) => [
            {
              description: eachQuerySchema.description,
              inputRequired: false,
              schema: {
                $schema: querySchema.$schema,
                enum: [enumOption],
                type,
              },
              title: enumOption as string,
            },
            getResponseSchema(responsesSchema[enumOption as string]),
          ]),
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
              description,
              inputRequired: !noInputRequired,
              schema: {
                ...msgSchema,
                $schema: querySchema.$schema,
                definitions: querySchema.definitions,
              },
              title,
            },
            getResponseSchema(responsesSchema[required[0]]),
          ],
        ];
      }

      return acc;
    },
    []
  );
};

export const getExecuteSchema = (
  schema: Nullish<CodeSchema>
): Option<ExecuteSchema> => {
  const executeSchema = getSchemaProperty(schema, SchemaProperties.EXECUTE);

  if (!executeSchema) return undefined;

  return executeSchema.oneOf?.reduce<Array<SchemaInfo>>((acc, msg) => {
    const eachExecuteSchema = msg as JsonSchema;
    const { enum: enumOptions, required, type } = eachExecuteSchema;
    const { description, ...msgSchema } = eachExecuteSchema;

    if (type === "string" && enumOptions) {
      return [
        ...acc,
        ...enumOptions.map<SchemaInfo>((enumOption) => ({
          description: eachExecuteSchema.description,
          schema: {
            $schema: eachExecuteSchema.$schema,
            enum: [enumOption],
            type,
          },
          title: enumOption as string,
        })),
      ];
    }
    return [
      ...acc,
      {
        description,
        schema: {
          ...msgSchema,
          $schema: executeSchema.$schema,
          definitions: executeSchema.definitions,
        },
        title: required?.[0],
      },
    ];
  }, []);
};

// ------------------------------------------//
// ---------------VERIFICATION---------------//
// ------------------------------------------//

export const getWasmVerifyStatus = (
  wasmVerifyInfo: Nullish<WasmVerifyInfo>
) => {
  if (!wasmVerifyInfo) return WasmVerifyStatus.NOT_VERIFIED;

  if (wasmVerifyInfo.verificationInfo === null) {
    if (wasmVerifyInfo.relatedVerifiedCodes.length === 0)
      return WasmVerifyStatus.NOT_VERIFIED;

    return WasmVerifyStatus.INDIRECTLY_VERIFIED;
  }

  if (wasmVerifyInfo.verificationInfo.errorMessage)
    return WasmVerifyStatus.FAILED;

  if (wasmVerifyInfo.verificationInfo.comparedTimestamp === null)
    return WasmVerifyStatus.IN_PROGRESS;

  return WasmVerifyStatus.VERIFIED;
};

export const formatRelatedVerifiedCodes = (relatedVerifiedCodes: number[]) => {
  const displayedCodes = relatedVerifiedCodes.slice(0, 3);

  let res = "";
  displayedCodes.forEach((code, index) => {
    res += code.toString();
    if (relatedVerifiedCodes.length > 2 && index < displayedCodes.length - 1)
      res += ",";
    if (index < displayedCodes.length - 1) res += " ";
    if (
      index === relatedVerifiedCodes.length - 2 &&
      index < displayedCodes.length - 1
    )
      res += "and ";
  });
  if (relatedVerifiedCodes.length > 3) res += " and more";

  return res;
};
