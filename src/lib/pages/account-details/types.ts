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
  stakingParams: Option<StakingParams>;
  isValidator: Option<boolean>;
  isLoading: Option<boolean>;
  totalBonded: Option<Record<string, TokenWithValue>>;
  isLoadingTotalBonded: boolean;
  totalDelegations: Option<Record<string, TokenWithValue>>;
  delegations: Option<Delegation[]>;
  isLoadingDelegations: boolean;
  totalUnbondings: Option<Record<string, TokenWithValue>>;
  unbondings: Option<Unbonding[]>;
  isLoadingUnbondings: boolean;
  totalRewards: Option<Record<string, TokenWithValue>>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  isLoadingRewards: boolean;
  redelegations: Option<Redelegation[]>;
  isLoadingRedelegations: boolean;
  totalCommission: Option<Record<string, TokenWithValue>>;
  isLoadingTotalCommission: boolean;
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

export const zAccDetailQueryParams = z.object({
  accountAddress: zAddr,
  // Remark: Didn't use enum here because we want to allow for redirect to overview
  tab: z.string().default(TabIndex.Overview),
});
