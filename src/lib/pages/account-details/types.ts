import { z } from "zod";

import {
  type Option,
  type TokenWithValue,
  type Validator,
  zAddr,
} from "lib/types";

import type {
  Delegation,
  Redelegation,
  StakingParams,
  Unbonding,
} from "./data";

export interface NonRedelegatable {
  dstValidator: Validator;
  completionTime: Date;
}

export interface UserDelegationsData {
  isLoading: boolean;
  stakingParams: Option<StakingParams>;
  isValidator: Option<boolean>;
  totalBonded: Option<Record<string, TokenWithValue>>;
  totalDelegations: Option<Record<string, TokenWithValue>>;
  delegations: Option<Delegation[]>;
  totalUnbondings: Option<Record<string, TokenWithValue>>;
  unbondings: Option<Unbonding[]>;
  totalRewards: Option<Record<string, TokenWithValue>>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  redelegations: Option<Redelegation[]>;
  totalCommission: Option<Record<string, TokenWithValue>>;
}

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

export const zAccountDetailQueryParams = z.object({
  accountAddress: zAddr,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
