import type { TokenWithValue, Validator } from "lib/types";

export interface BondedInfo {
  validator: Validator;
  amount: TokenWithValue;
  reward?: TokenWithValue;
  completionTime?: Date;
}
