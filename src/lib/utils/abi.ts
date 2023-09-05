import type { ExposedFunction, ResponseABI } from "lib/types";

export const parseJsonABI = (jsonString: string): ResponseABI => {
  try {
    return JSON.parse(jsonString);
  } catch {
    throw new Error(`Failed to parse ABI from JSON string: ${jsonString}`);
  }
};

const sortByIsEntry = (a: ExposedFunction, b: ExposedFunction) => {
  if (a.is_entry === b.is_entry) return 0;
  return a.is_entry ? -1 : 1;
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

  functionMap.view.sort(sortByIsEntry);
  functionMap.execute.sort(sortByIsEntry);

  return functionMap;
};
