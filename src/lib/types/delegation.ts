import type { TokenWithValue } from "./asset";
import type { Validator } from "./validator";

export interface Delegation {
  balances: TokenWithValue[];
  validator: Validator;
}

export interface NonRedelegatable {
  completionTime: Date;
  dstValidator: Validator;
}

export interface Redelegation {
  balances: TokenWithValue[];
  completionTime: Date;
  dstValidator: Validator;
  srcValidator: Validator;
}

export interface StakingParams {
  bondDenoms: TokenWithValue[];
  maxEntries: number;
  unbondingTime: string; // e.g. "14 days"
}

export interface Unbonding {
  balances: TokenWithValue[];
  completionTime: Date;
  validator: Validator;
}
