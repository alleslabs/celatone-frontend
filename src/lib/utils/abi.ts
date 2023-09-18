import { BCS } from "@initia/initia.js";

import type {
  AbiFormData,
  ExposedFunction,
  Option,
  ResponseABI,
} from "lib/types";

export const checkAvailability = (fn: ExposedFunction) =>
  fn.visibility === "public" && (fn.is_view || fn.is_entry);

export const parseJsonABI = (jsonString: string): ResponseABI => {
  try {
    return JSON.parse(jsonString);
  } catch {
    throw new Error(`Failed to parse ABI from JSON string: ${jsonString}`);
  }
};

const sortByAvailability = (a: ExposedFunction, b: ExposedFunction) => {
  if (checkAvailability(a) === checkAvailability(b)) return 0;
  return checkAvailability(a) ? -1 : 1;
};

export const splitViewExecuteFunctions = (functions: ExposedFunction[]) => {
  const functionMap = functions.reduce<{
    view: ExposedFunction[];
    execute: ExposedFunction[];
  }>(
    (acc, fn) => {
      if (fn.is_view) {
        acc.view.push(fn);
      } else {
        acc.execute.push(fn);
      }
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
  value: Option<string>;
}) => {
  try {
    if (value === undefined) return null;
    if (type.startsWith("vector")) return JSON.parse(value) as string[];
    return value.trim();
  } catch (e) {
    return "";
  }
};

const serializeArg = (
  arg: { type: string; value: Option<string> },
  bcs: BCS
) => {
  try {
    const argType = getArgType(arg.type);
    const argValue = getArgValue(arg);
    return bcs.serialize(argType, argValue);
  } catch (e) {
    return "";
  }
};

export const serializeAbiData = (fn: ExposedFunction, abiData: AbiFormData) => {
  const bcs = BCS.getInstance();
  const serializedArgs = fn.params.map((type, index) =>
    serializeArg({ type, value: abiData.args[index] }, bcs)
  );
  return {
    typeArgs: fn.generic_type_params.map((_, index) => abiData.typeArgs[index]),
    args: serializedArgs,
  };
};
