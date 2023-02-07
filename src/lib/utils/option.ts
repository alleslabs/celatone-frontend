import type { Option } from "lib/types";

export const unwrap = <T>(
  data: Option<T> | Option<T | null>,
  errorMsg?: string
): T => {
  if (!data) throw new Error(errorMsg || "Cannot unwrap the given data");
  return data;
};
