import type { Option } from "lib/types";

export const unwrap = <T>(data: Option<T>, errorMsg?: string): T => {
  if (!data) throw new Error(errorMsg || "Cannot unwrap the given data");
  return data;
};
