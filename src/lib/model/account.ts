import type Big from "big.js";

import { useGovConfig } from "lib/app-provider";
import { useAssetInfos } from "lib/services/assetService";
import { useBalanceInfos } from "lib/services/bank";
import { useDelegationsByAddress } from "lib/services/delegationService";
import { useMovePoolInfos } from "lib/services/move";
import { big } from "lib/types";
import type {
  BechAddr,
  Delegation,
  Option,
  Redelegation,
  StakingParams,
  TokenWithValue,
  Unbonding,
  USD,
} from "lib/types";
import {
  addTokenWithValue,
  coinToTokenWithValue,
  compareTokenWithValues,
  formatSeconds,
  totalValueTokenWithValue,
} from "lib/utils";

interface UserDelegationsData {
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

// ------------------------------------------//
// ----------------DELEGATIONS---------------//
// ------------------------------------------//

const calBonded = (
  totalDelegations: Option<Record<string, TokenWithValue>>,
  totalUnbondings: Option<Record<string, TokenWithValue>>
) => {
  if (!totalDelegations || !totalUnbondings) return undefined;

  return Object.keys(totalDelegations).reduce<Record<string, TokenWithValue>>(
    (total, denom) => ({
      ...total,
      [denom]: addTokenWithValue(
        totalUnbondings[denom],
        totalDelegations[denom]
      ),
    }),
    {}
  );
};

export const useAccountDelegationInfos = (address: BechAddr) => {
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos, isLoading: isLoadingMovePoolInfos } =
    useMovePoolInfos({
      withPrices: true,
    });

  const { data: accountDelegations, isLoading: isLoadingAccountDelegations } =
    useDelegationsByAddress(address);

  const isLoading =
    isLoadingAccountDelegations ||
    isLoadingAssetInfos ||
    isLoadingMovePoolInfos;

  const data: UserDelegationsData = {
    isLoading,
    stakingParams: undefined,
    isValidator: undefined,
    totalBonded: undefined,
    totalDelegations: undefined,
    delegations: undefined,
    totalUnbondings: undefined,
    unbondings: undefined,
    totalRewards: undefined,
    rewards: undefined,
    redelegations: undefined,
    totalCommission: undefined,
  };

  if (accountDelegations) {
    data.stakingParams = {
      ...accountDelegations.stakingParams,
      unbondingTime: formatSeconds(
        accountDelegations.stakingParams.unbondingTime
      ),
      bondDenoms: accountDelegations.stakingParams.bondDenoms.map((denom) =>
        coinToTokenWithValue(denom, "0", assetInfos, movePoolInfos)
      ),
    };

    data.isValidator = accountDelegations.isValidator;

    data.delegations = accountDelegations.delegations.map<Delegation>(
      (raw) => ({
        validator: raw.validator,
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
      validator: raw.validator,
      completionTime: raw.completionTime,
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
        srcValidator: raw.srcValidator,
        dstValidator: raw.dstValidator,
        completionTime: raw.completionTime,
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
      })
    );

    data.totalCommission = accountDelegations.commissions.reduce<
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

export const useAccountTotalValue = (address: BechAddr) => {
  const defaultValue = big(0) as USD<Big>;

  const gov = useGovConfig({ shouldRedirect: false });
  const {
    totalSupportedAssetsValue = defaultValue,
    isLoading: isLoadingTotalSupportedAssetsValue,
  } = useBalanceInfos(address);
  const {
    isLoading,
    stakingParams,
    totalBonded,
    totalRewards,
    totalCommission,
  } = useAccountDelegationInfos(address);

  if (!gov.enabled)
    return {
      totalAccountValue: totalSupportedAssetsValue,
      isLoading: false,
    };

  if (isLoading || isLoadingTotalSupportedAssetsValue)
    return { totalAccountValue: undefined, isLoading: true };

  if (!stakingParams || !totalBonded || !totalRewards || !totalCommission)
    return { totalAccountValue: undefined, isLoading: false };

  return {
    totalAccountValue: totalSupportedAssetsValue
      .add(totalValueTokenWithValue(totalBonded, defaultValue))
      .add(totalValueTokenWithValue(totalRewards, defaultValue))
      .add(totalValueTokenWithValue(totalCommission, defaultValue)) as USD<Big>,
    isLoading: false,
  };
};
