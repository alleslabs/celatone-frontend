import type { ExposedFunction, ResponseABI } from "lib/types";

export const parseJsonABI = (jsonString: string): ResponseABI => {
  try {
    return JSON.parse(jsonString);
  } catch {
    throw new Error("Fail to parse ABI json string");
  }
};

const sortByIsEntry = (a: ExposedFunction, b: ExposedFunction) => {
  if (a.is_entry === b.is_entry) return 0;
  return a.is_entry ? -1 : 1;
};

export const splitViewExecuteFunctions = (functions: ExposedFunction[]) => {
  const functionMap: { [key in "view" | "execute"]: ExposedFunction[] } = {
    view: [],
    execute: [],
  };
  functions.forEach((fn) =>
    fn.is_view ? functionMap.view.push(fn) : functionMap.execute.push(fn)
  );
  functionMap.view.sort(sortByIsEntry);
  functionMap.execute.sort(sortByIsEntry);

  return functionMap;
};
