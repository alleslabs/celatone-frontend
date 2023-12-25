import { z } from "zod";

import { type ValidatorAddr, zValidatorAddr } from "./addrs";

export interface Validator {
  validatorAddress: ValidatorAddr;
  moniker?: string;
  identity?: string;
}

export const zValidator = z
  .object({
    validator_address: zValidatorAddr,
    identity: z.string().nullable(),
    moniker: z.string().nullable(),
  })
  .transform<Validator>((val) => ({
    validatorAddress: val.validator_address,
    identity: val.identity ? val.identity : undefined,
    moniker: val.moniker ? val.moniker : undefined,
  }));
