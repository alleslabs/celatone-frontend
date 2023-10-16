import { getSchemaType, type RJSFSchema } from "@rjsf/utils";

import type { SchemaInfo } from "lib/stores/schema";
import type { JsonDataType } from "lib/types";

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

export const parseJsonStr = (json: string, fallback = ""): JsonDataType => {
  try {
    return JSON.parse(json);
  } catch (_) {
    return fallback;
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
  const { type, required, enum: enumOptions, properties } = msgSchema.schema;
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
  const { required, enum: enumOptions } = msgSchema.schema;
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
