import type { ExposedFunction, ResponseABI } from "lib/types";

export const checkAvailability = (fn: ExposedFunction) =>
  fn.visibility === "public" && (fn.is_view || fn.is_entry);

export const parseJsonABI = (jsonString: string): ResponseABI => {
  try {
    return JSON.parse(jsonString);
  } catch {
    throw new Error("Fail to parse ABI json string");
  }
};

const sortByAvailability = (a: ExposedFunction, b: ExposedFunction) => {
  if (checkAvailability(a) === checkAvailability(b)) return 0;
  return checkAvailability(a) ? -1 : 1;
};

export const splitViewExecuteFunctions = (functions: ExposedFunction[]) => {
  const functionMap: { [key in "view" | "execute"]: ExposedFunction[] } = {
    view: [],
    execute: [],
  };
  functions.forEach((fn) =>
    fn.is_view ? functionMap.view.push(fn) : functionMap.execute.push(fn)
  );
  functionMap.view.sort(sortByAvailability);
  functionMap.execute.sort(sortByAvailability);

  return functionMap;
};
