import type { Addr } from "lib/types";

/**
 * @input init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d::any::pack
 * @returns [init1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqr5e3d,any,pack]
 */

type ModulePaths = [Addr, string, string] | [Addr, string] | [Addr];

export const splitModulePath = (path: string): ModulePaths => {
  return path.split("::") as ModulePaths;
};

export const mergeModulePath = (...module: ModulePaths): string =>
  module.join("::");
