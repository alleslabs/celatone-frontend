import type { ExposedFunction, ResponseABI } from "lib/types";

export const parseJsonABI = (jsonString: string): ResponseABI => {
  try {
    return JSON.parse(jsonString);
  } catch {
    throw new Error("Fail to parse ABI json string");
  }
};

export const splitViewExecuteFunctions = (functions: ExposedFunction[]) => {
  const functionMap: { [key in "view" | "execute"]: ExposedFunction[] } = {
    view: [],
    execute: [],
  };
  functions.forEach((fn) =>
    fn.is_view ? functionMap.view.push(fn) : functionMap.execute.push(fn)
  );
  return functionMap;
};
