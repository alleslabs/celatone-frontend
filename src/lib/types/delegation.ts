import type { TokenWithValue } from "./asset";
import type { Validator } from "./validator";

export interface StakingParams {
  unbondingTime: string; // e.g. "14 days"
  maxEntries: number;
  bondDenoms: TokenWithValue[];
}

export interface Delegation {
  validator: Validator;
  balances: TokenWithValue[];
}

export interface Unbonding {
  validator: Validator;
  completionTime: Date;
  balances: TokenWithValue[];
}

export interface Redelegation {
  srcValidator: Validator;
  dstValidator: Validator;
  completionTime: Date;
  balances: TokenWithValue[];
}

export interface NonRedelegatable {
  dstValidator: Validator;
  completionTime: Date;
}
