import type { Addr } from "lib/types";

/**
 * @input init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d::any::pack
 * @returns [init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d,any,pack]
 */

type SplitReturn = [Addr] | [Addr, string] | [Addr, string, string];

export const splitModule = (path: string): SplitReturn => {
  return path.split("::") as SplitReturn;
};
