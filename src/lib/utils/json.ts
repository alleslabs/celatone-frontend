import type { RJSFSchema } from "@rjsf/utils";
import type { JsonDataType, SchemaInfo } from "lib/types";

import { getSchemaType } from "@rjsf/utils";

export const jsonValidate = (text: string) => {
  try {
    if (text.trim().length === 0)
      throw new SyntaxError(`Can't use empty string`);
    JSON.parse(text);
    return null;
  } catch (error) {
    return (error as SyntaxError).message;
  }
};

export const jsonPrettify = (text: string) => {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
};

export const jsonLineCount = (text: string) => text.split(/\n/).length;

export const parseJsonStr = <T extends JsonDataType>(
  json: string,
  fallback = ""
): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback as T;
  }
};

export const isNonEmptyJsonData = (jsonData: JsonDataType): boolean => {
  if (jsonData === null || jsonData === undefined) return false;
  if (typeof jsonData === "string") return Boolean(jsonData.length);
  if (typeof jsonData === "object")
    return Boolean(Object.keys(jsonData).length);
  return true;
};

export const getDefaultMsg = (msgSchema: SchemaInfo) => {
  const { enum: enumOptions, properties, required, type } = msgSchema.schema;
  if (type === "object") {
    if (required && properties) {
      const propertyName = Object.keys(properties)[0];
      if (getSchemaType(properties[propertyName] as RJSFSchema) === "object")
        return { [required[0]]: {} };
    }
    return {};
  }

  if (enumOptions && enumOptions.length > 0) return enumOptions[0];
  return "";
};

export const resolveInitialMsg = (
  initialMsg: string,
  msgSchema: SchemaInfo
) => {
  const parsed = parseJsonStr(initialMsg);
  const { enum: enumOptions, required } = msgSchema.schema;
  if (
    typeof parsed === "object" &&
    Object.keys(parsed as object)[0] === required?.[0]
  )
    return parsed;
  if (
    typeof parsed === "string" &&
    ((enumOptions ?? []) as string[]).includes(parsed)
  )
    return parsed;

  return getDefaultMsg(msgSchema);
};
