import type {
  BechAddr,
  Delegation,
  Redelegation,
  TokenWithValue,
  Unbonding,
} from "lib/types";

import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import { useDelegationData } from "lib/services/staking";
import {
  addTokenWithValue,
  coinToTokenWithValue,
  compareTokenWithValues,
} from "lib/utils";

import type { DelegationInfos } from "./types";

import { calBonded } from "./utils";

export const useAccountDelegationInfosApi = (
  address: BechAddr,
  enabled: boolean
) => {
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos, isLoading: isLoadingMovePoolInfos } =
    useMovePoolInfos({
      withPrices: true,
    });

  const { data: accountDelegations, isFetching: isLoadingAccountDelegations } =
    useDelegationData(address, enabled);

  const isLoading =
    isLoadingAccountDelegations ||
    isLoadingAssetInfos ||
    isLoadingMovePoolInfos;

  const data: DelegationInfos = {
    delegations: undefined,
    isCommissionsLoading: isLoading,
    isDelegationsLoading: isLoading,
    isLoading,
    isRedelegationsLoading: isLoading,
    isRewardsLoading: isLoading,
    isTotalBondedLoading: isLoading,
    isUnbondingsLoading: isLoading,
    isValidator: undefined,
    redelegations: undefined,
    rewards: undefined,
    stakingParams: undefined,
    totalBonded: undefined,
    totalCommissions: undefined,
    totalDelegations: undefined,
    totalRewards: undefined,
    totalUnbondings: undefined,
    unbondings: undefined,
  };

  if (accountDelegations) {
    data.stakingParams = {
      ...accountDelegations.stakingParams,
      bondDenoms: accountDelegations.stakingParams.bondDenoms.map((denom) =>
        coinToTokenWithValue(denom, "0", assetInfos, movePoolInfos)
      ),
    };

    data.isValidator = accountDelegations.isValidator;

    data.delegations = accountDelegations.delegations.map<Delegation>(
      (raw) => ({
        balances: raw.balance
          .map((coin) =>
            coinToTokenWithValue(
              coin.denom,
              coin.amount,
              assetInfos,
              movePoolInfos
            )
          )
          .sort(compareTokenWithValues),
        validator: raw.validator,
      })
    );
    data.totalDelegations = data.delegations?.reduce<
      Record<string, TokenWithValue>
    >(
      (total, delegation) =>
        delegation.balances.reduce(
          (acc, balance) => ({
            ...acc,
            [balance.denom]: addTokenWithValue(acc[balance.denom], balance),
          }),
          total
        ),
      {}
    );

    data.unbondings = accountDelegations.unbondings.map<Unbonding>((raw) => ({
      balances: raw.balance
        .map((coin) =>
          coinToTokenWithValue(
            coin.denom,
            coin.amount,
            assetInfos,
            movePoolInfos
          )
        )
        .sort(compareTokenWithValues),
      completionTime: raw.completionTime,
      validator: raw.validator,
    }));
    data.totalUnbondings = data.unbondings?.reduce<
      Record<string, TokenWithValue>
    >(
      (total, unbonding) =>
        unbonding.balances.reduce(
          (acc, balance) => ({
            ...acc,
            [balance.denom]: addTokenWithValue(acc[balance.denom], balance),
          }),
          total
        ),
      {}
    );

    data.rewards = accountDelegations.delegationRewards.rewards.reduce<
      Record<string, TokenWithValue[]>
    >(
      (prev, raw) => ({
        ...prev,
        [raw.validator.validatorAddress]: raw.reward
          .map<TokenWithValue>((coin) =>
            coinToTokenWithValue(
              coin.denom,
              coin.amount,
              assetInfos,
              movePoolInfos
            )
          )
          .sort(compareTokenWithValues),
      }),
      {}
    );
    data.totalRewards = accountDelegations.delegationRewards.total.reduce<
      Record<string, TokenWithValue>
    >(
      (total, raw) => ({
        ...total,
        [raw.denom]: coinToTokenWithValue(
          raw.denom,
          raw.amount,
          assetInfos,
          movePoolInfos
        ),
      }),
      {}
    );

    data.redelegations = accountDelegations.redelegations.map<Redelegation>(
      (raw) => ({
        balances: raw.balance
          .map((coin) =>
            coinToTokenWithValue(
              coin.denom,
              coin.amount,
              assetInfos,
              movePoolInfos
            )
          )
          .sort(compareTokenWithValues),
        completionTime: raw.completionTime,
        dstValidator: raw.dstValidator,
        srcValidator: raw.srcValidator,
      })
    );

    data.totalCommissions = accountDelegations.commissions.reduce<
      Record<string, TokenWithValue>
    >(
      (commission, raw) => ({
        ...commission,
        [raw.denom]: coinToTokenWithValue(
          raw.denom,
          raw.amount,
          assetInfos,
          movePoolInfos
        ),
      }),
      {}
    );

    data.totalBonded = calBonded(data.totalDelegations, data.totalUnbondings);
  }

  return data;
};
