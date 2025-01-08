import type {
  Delegation,
  Option,
  Redelegation,
  StakingParams,
  TokenWithValue,
  Unbonding,
} from "lib/types";

export interface DelegationInfos {
  delegations: Option<Delegation[]>;
  isCommissionsLoading: boolean;
  isDelegationsLoading: boolean;
  isLoading: boolean;
  isRedelegationsLoading: boolean;
  isRewardsLoading: boolean;
  isTotalBondedLoading: boolean;
  isUnbondingsLoading: boolean;
  isValidator: Option<boolean>;
  redelegations: Option<Redelegation[]>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  stakingParams: Option<StakingParams>;
  totalBonded: Option<Record<string, TokenWithValue>>;
  totalCommissions: Option<Record<string, TokenWithValue>>;
  totalDelegations: Option<Record<string, TokenWithValue>>;
  totalRewards: Option<Record<string, TokenWithValue>>;
  totalUnbondings: Option<Record<string, TokenWithValue>>;
  unbondings: Option<Unbonding[]>;
}
