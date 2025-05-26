import type {
  AbiFormData,
  ExposedFunction,
  ModuleAbi,
  Nullable,
} from "lib/types";

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
    return a.name.localeCompare(b.name);
  return checkAvailability(a) ? -1 : 1;
};

const splitViewExecuteFunctions = (functions: ExposedFunction[]) => {
  const functionMap = functions.reduce<{
    execute: ExposedFunction[];
    view: ExposedFunction[];
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
      execute: [],
      view: [],
    }
  );

  functionMap.view.sort(sortByAvailability);
  functionMap.execute.sort(sortByAvailability);

  return functionMap;
};

export const indexModuleAbi = (abi: string) => {
  const parsedAbi = parseJsonABI<ModuleAbi>(abi);
  const { execute, view } = splitViewExecuteFunctions(
    parsedAbi.exposed_functions
  );
  return {
    executeFunctions: execute,
    parsedAbi,
    viewFunctions: view,
  };
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
export const getVectorElements = (value: string) => {
  const trimmed = value.split(/\[(.*)\]/)[1].trim();
  if (trimmed.length === 0) return [];
  return trimmed.split(",").map((element) => element.trim());
};

export const getArgType = (argType: string) =>
  argType
    .replace("0x1::string::String", "string")
    .replace("0x1::option::Option", "option")
    .replace("0x1::object::Object", "object")
    .replace("0x1::fixed_point32::FixedPoint32", "fixed_point32")
    .replace("0x1::fixed_point64::FixedPoint64", "fixed_point64")
    .replace("0x1::decimal128::Decimal128", "decimal128")
    .replace("0x1::decimal256::Decimal256", "decimal256");

const serializeArgJson = (arg: { type: string; value: Nullable<string> }) => {
  if (arg.type === "bool") return String(arg.value);
  return JSON.stringify(arg.value);
};

export const serializeAbiDataJson = (
  fn: ExposedFunction,
  abiData: AbiFormData
) => {
  const serializedArgs = fn.params.map((type, index) =>
    serializeArgJson({ type, value: abiData.args[index] })
  );

  const serializedTypeArgs = fn.generic_type_params.map(
    (_, index) => abiData.typeArgs[index] ?? ""
  );

  return {
    args: serializedArgs,
    typeArgs: serializedTypeArgs,
  };
};
