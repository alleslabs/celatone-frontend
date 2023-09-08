import type { AccountAddr } from "lib/types";

/**
 * @input init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d::any::pack
 * @returns [init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d,any,pack]
 */

type SplitReturn =
  | [AccountAddr, undefined, undefined]
  | [AccountAddr, string, undefined]
  | [AccountAddr, string, string];

export const splitModule = (path: string): SplitReturn => {
  return path.split("::") as SplitReturn;
};
