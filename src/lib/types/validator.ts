import type { ValidatorAddr } from "./addrs";

export interface Validator {
  validatorAddress: ValidatorAddr;
  moniker?: string;
  identity?: string;
}
