import type { ExposedFunction, ResponseABI } from "lib/types";

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

export const getAbiInitialData = (length: number): Record<string, string> =>
  Array(length)
    .fill("")
    .reduce<Record<string, string>>(
      (prev, _, index) => ({ ...prev, [index.toString()]: "" }),
      {}
    );
