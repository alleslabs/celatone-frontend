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

export enum AccountTypeLcd {
  BaseAccount = "/cosmos.auth.v1beta1.BaseAccount",
  ModuleAccount = "/cosmos.auth.v1beta1.ModuleAccount",
}

export const zPubkey = z.object({
  "@type": z.string(),
  key: z.string(),
});

export type Pubkey = z.infer<typeof zPubkey>;
