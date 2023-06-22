import type { ValidatorAddr } from "./addrs";
import type { Option } from "./common";

export interface ValidatorInfo {
  validatorAddress: ValidatorAddr;
  moniker: Option<string>;
  identity: string;
}
