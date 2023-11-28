import type { TokenWithValue, ValidatorInfo } from "lib/types";

export interface BondedInfo {
  validator: ValidatorInfo;
  amount: TokenWithValue;
  reward?: TokenWithValue;
  completionTime?: Date;
}
