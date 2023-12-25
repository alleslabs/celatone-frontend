import { z } from "zod";

import { zAddr } from "lib/types";
import type { TokenWithValue, Validator } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Assets = "assets",
  Delegations = "delegations",
  Txs = "txs",
  Codes = "codes",
  Contracts = "contracts",
  Admins = "admins",
  Resources = "resources",
  Modules = "modules",
  Proposals = "proposals",
}

export const zAccountDetailsQueryParams = z.object({
  accountAddress: zAddr,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});

export interface StakingParams {
  unbondingTime: string; // e.g. "14 days"
  maxEntries: number;
  bondDenoms: TokenWithValue[];
}

export interface Delegation {
  validator: Validator;
  balances: TokenWithValue[];
}

export interface Unbonding {
  validator: Validator;
  completionTime: Date;
  balances: TokenWithValue[];
}

export interface Redelegation {
  srcValidator: Validator;
  dstValidator: Validator;
  completionTime: Date;
  balances: TokenWithValue[];
}

export interface NonRedelegatable {
  dstValidator: Validator;
  completionTime: Date;
}
