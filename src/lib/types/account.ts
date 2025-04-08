import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { z } from "zod";

export enum AccountType {
  BaseAccount = "BaseAccount",
  InterchainAccount = "InterchainAccount",
  ModuleAccount = "ModuleAccount",
  ContinuousVestingAccount = "ContinuousVestingAccount",
  DelayedVestingAccount = "DelayedVestingAccount",
  ClawbackVestingAccount = "ClawbackVestingAccount",
  ContractAccount = "ContractAccount",
  PeriodicVestingAccount = "PeriodicVestingAccount",
  PermanentLockedAccount = "PermanentLockedAccount",
  BaseVestingAccount = "BaseVestingAccount",
}

export enum AccountTypeRest {
  BaseAccount = "/cosmos.auth.v1beta1.BaseAccount",
  ModuleAccount = "/cosmos.auth.v1beta1.ModuleAccount",
}

export const zPubkeySingle = z.object({
  "@type": z.string(),
  key: z.string(),
});
export type PubkeySingle = z.infer<typeof zPubkeySingle>;

export const zPubkeyMulti = z
  .object({
    "@type": z.string(),
    public_keys: z.array(zPubkeySingle),
    threshold: z.number(),
  })
  .transform(snakeToCamel);
export type PubkeyMulti = z.infer<typeof zPubkeyMulti>;

export const zPubkey = z.union([zPubkeySingle, zPubkeyMulti]);
export type Pubkey = z.infer<typeof zPubkey>;
