import type {
  Delegation,
  Option,
  Redelegation,
  StakingParams,
  TokenWithValue,
  Unbonding,
} from "lib/types";

export interface DelegationInfos {
  isLoading: boolean;
  stakingParams: Option<StakingParams>;
  isValidator: Option<boolean>;
  isTotalBondedLoading: boolean;
  totalBonded: Option<Record<string, TokenWithValue>>;
  isDelegationsLoading: boolean;
  totalDelegations: Option<Record<string, TokenWithValue>>;
  delegations: Option<Delegation[]>;
  isUnbondingsLoading: boolean;
  totalUnbondings: Option<Record<string, TokenWithValue>>;
  unbondings: Option<Unbonding[]>;
  isRewardsLoading: boolean;
  totalRewards: Option<Record<string, TokenWithValue>>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  isRedelegationsLoading: boolean;
  redelegations: Option<Redelegation[]>;
  isCommissionsLoading: boolean;
  totalCommissions: Option<Record<string, TokenWithValue>>;
}
