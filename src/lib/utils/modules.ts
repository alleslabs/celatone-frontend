import type { MoveAccountAddr } from "lib/types";

/**
 * @input init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d::any::pack
 * @returns [init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d,any,pack]
 */

type SplitReturn =
  | [MoveAccountAddr, undefined, undefined]
  | [MoveAccountAddr, string, undefined]
  | [MoveAccountAddr, string, string];

export const splitModule = (path: string): SplitReturn => {
  return path.split("::") as SplitReturn;
};
