import type { TokenWithValue, Validator } from "lib/types";

export interface BondedInfo {
  amount: TokenWithValue;
  completionTime?: Date;
  reward?: TokenWithValue;
  validator: Validator;
}
