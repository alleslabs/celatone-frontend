import type { ValidatorAddr } from "./addrs";
import type { Option } from "./common";

export interface Validator {
  validatorAddress: ValidatorAddr;
  moniker: string;
  identity: string;
}

export interface ValidatorInfo {
  validatorAddress: ValidatorAddr;
  moniker: Option<string>;
}
