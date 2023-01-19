import type { Option } from "lib/types";

export const unwrapOrDefault = <T>(data: Option<T>, default_value: T): T => {
  return data || default_value;
};
