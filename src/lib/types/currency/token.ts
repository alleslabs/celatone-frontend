import type { NominalType } from "./common";

export type U<T = string> = T & { __micro: true };

// Gas
export type Gas<T = number> = T & NominalType<"gas">;

// All currencies
export type Token<T = string> = T & NominalType<string>;

export type USD<T = string> = T & NominalType<"usd">;

export interface ChainGasPrice {
  denom: string;
  gasPrice: U<Token>;
}
