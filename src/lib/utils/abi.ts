import { BCS } from "@initia/initia.js";

import type { AbiFormData, ExposedFunction, Nullable } from "lib/types";

export const checkAvailability = (fn: ExposedFunction) =>
  fn.is_view || fn.is_entry;

export const parseJsonABI = <T>(jsonString: string): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    throw new Error(`Failed to parse ABI from JSON string: ${jsonString}`);
  }
};

const sortByAvailability = (a: ExposedFunction, b: ExposedFunction) => {
  if (checkAvailability(a) === checkAvailability(b))
    return a.name < b.name ? -1 : 1;
  return checkAvailability(a) ? -1 : 1;
};

export const splitViewExecuteFunctions = (functions: ExposedFunction[]) => {
  const functionMap = functions.reduce<{
    view: ExposedFunction[];
    execute: ExposedFunction[];
  }>(
    (acc, fn) => {
      if (fn.is_view) acc.view.push(fn);
      // Filtering out execute fns with
      // is_entry === false and visibility === private
      // as these fns are this module's internal fns
      else if (fn.is_entry || fn.visibility !== "private") acc.execute.push(fn);
      return acc;
    },
    {
      view: [],
      execute: [],
    }
  );

  functionMap.view.sort(sortByAvailability);
  functionMap.execute.sort(sortByAvailability);

  return functionMap;
};

export const getAbiInitialData = (length: number) =>
  Array(length)
    .fill("")
    .reduce<Record<string, string>>(
      (prev, _, index) => ({ ...prev, [index.toString()]: "" }),
      {}
    );

// ------------------------------------------//
// -----------------MOVE ARGS----------------//
// ------------------------------------------//
const getArgType = (argType: string) =>
  argType
    .replaceAll("0x1::string::String", "string")
    .replaceAll("0x1::option::Option", "option");

const getArgValue = ({
  type,
  value,
}: {
  type: string;
  value: Nullable<string>;
}) => {
  try {
    if (value === null) return null;
    if (type.startsWith("vector")) {
      const [, elementType] = type.split(/<(.*)>/);
      const values = value
        .split(/\[(.*)\]/)[1]
        .split(",")
        .map((element) => element.trim());
      return elementType === "bool"
        ? values.map((element) => element.toLowerCase() === "true")
        : values;
    }
    if (type === "bool") return value === "true";
    return value.trim();
  } catch (e) {
    return "";
  }
};

const BUFFER_SIZE = 1024 * 1024;
const bcs = BCS.getInstance();

const serializeArg = (arg: { type: string; value: Nullable<string> }) => {
  try {
    const argType = getArgType(arg.type);
    const argValue = getArgValue(arg);
    return bcs.serialize(argType, argValue, BUFFER_SIZE);
  } catch (e) {
    return "";
  }
};

export const serializeAbiData = (fn: ExposedFunction, abiData: AbiFormData) => {
  const serializedArgs = fn.params.map((type, index) =>
    serializeArg({ type, value: abiData.args[index] })
  );
  return {
    typeArgs: fn.generic_type_params.map((_, index) => abiData.typeArgs[index]),
    args: serializedArgs,
  };
};
