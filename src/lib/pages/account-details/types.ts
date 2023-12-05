import { type Option, type TokenWithValue, type Validator } from "lib/types";

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
