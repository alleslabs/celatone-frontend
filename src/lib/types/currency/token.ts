import type { z } from "zod";

import type { NominalType } from "../common";

export type U<T = string> = T & { __micro: true };

// Gas
export const zGas = <T extends z.ZodTypeAny>(zType: T) => zType.brand("gas");
export type Gas<T = number> = T & z.BRAND<"gas">;

// All currencies
export type Token<T = string> = NominalType<string> & T;

export type USD<T = string> = NominalType<"usd"> & T;

// Percentage
export const zRatio = <T extends z.ZodTypeAny>(zType: T) =>
  zType.brand("ratio");
export interface ChainGasPrice {
  denom: string;
  gasPrice: U<Token>;
}

export type Percent<T = string> = NominalType<"percent"> & T;

export type Ratio<T = string> = T & z.BRAND<"ratio">;
