import type {
  BechAddr,
  BechAddr20,
  Delegation,
  Redelegation,
  TokenWithValue,
  Unbonding,
  ValidatorAddr,
  ValidatorData,
} from "lib/types";

import { useValidateAddress } from "lib/app-provider";
import { useAssetInfos } from "lib/services/assetService";
import {
  useCommissionsByValidatorAddressRest,
  useDelegationRewardsByAddressRest,
} from "lib/services/distribution";
import { useMovePoolInfos } from "lib/services/move/poolService";
import {
  useDelegationsByAddressRest,
  useRedelegationsByAddressRest,
  useStakingParamsRest,
  useUnbondingsByAddressRest,
} from "lib/services/staking";
import { useValidatorsRest } from "lib/services/validator";
import {
  addrToValoper,
  addTokenWithValue,
  coinToTokenWithValue,
} from "lib/utils";
import { useMemo } from "react";

import type { DelegationInfos } from "./types";

import { calBonded } from "./utils";

export const useAccountDelegationInfosRest = (
  address: BechAddr,
  enabled: boolean
) => {
  const { validateUserAddress } = useValidateAddress();
  const isBechAddr20 = validateUserAddress(address) === null;
  const valAddr = isBechAddr20
    ? addrToValoper(address as BechAddr20)
    : undefined;

  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos, isLoading: isMovePoolInfosLoading } =
    useMovePoolInfos({
      withPrices: true,
    });

  const { data: stakingParams, isFetching: isStakingParamsLoading } =
    useStakingParamsRest(enabled);
  const { data: delegations, isFetching: isDelegationsLoading } =
    useDelegationsByAddressRest(address, enabled);
  const { data: unbondings, isFetching: isUnbondingsLoading } =
    useUnbondingsByAddressRest(address, enabled);
  const { data: redelegations, isFetching: isRedelegationsLoading } =
    useRedelegationsByAddressRest(address, enabled);
  const { data: rewards, isFetching: isRewardsLoading } =
    useDelegationRewardsByAddressRest(address, enabled);

  const { data: commissions, isFetching: isCommissionsLoading } =
    useCommissionsByValidatorAddressRest(valAddr, enabled);

  const { data: validators, isFetching: isValidatorsLoading } =
    useValidatorsRest(enabled);
  const validatorsMap = useMemo(
    () =>
      validators?.reduce<Record<ValidatorAddr, ValidatorData>>(
        (prev, val) => ({ ...prev, [val.validatorAddress]: val }),
        {}
      ),
    [validators]
  );

  const isLoading =
    isStakingParamsLoading ||
    isValidatorsLoading ||
    isAssetInfosLoading ||
    isMovePoolInfosLoading;
  const data: DelegationInfos = {
    delegations: undefined,
    isCommissionsLoading,
    isDelegationsLoading,
    isLoading,
    isRedelegationsLoading,
    isRewardsLoading,
    isTotalBondedLoading: isDelegationsLoading || isUnbondingsLoading,
    isUnbondingsLoading,
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

  if (stakingParams && assetInfos && validators) {
    data.stakingParams = {
      ...stakingParams,
      bondDenoms: [
        coinToTokenWithValue(
          stakingParams.bondDenom,
          "0",
          assetInfos,
          movePoolInfos
        ),
      ],
    };

    data.isValidator = valAddr ? validatorsMap?.[valAddr] !== undefined : false;

    data.delegations = delegations?.map<Delegation>(
      ({ balance, delegation }) => ({
        balances: [
          coinToTokenWithValue(
            balance.denom,
            balance.amount,
            assetInfos,
            movePoolInfos
          ),
        ],
        validator: {
          identity: validatorsMap?.[delegation.validatorAddress]?.identity,
          moniker: validatorsMap?.[delegation.validatorAddress]?.moniker,
          validatorAddress: delegation.validatorAddress,
        },
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

    data.unbondings = unbondings?.map<Unbonding>((unbonding) => ({
      balances: [
        coinToTokenWithValue(
          stakingParams.bondDenom,
          unbonding.balance,
          assetInfos,
          movePoolInfos
        ),
      ],
      completionTime: unbonding.completionTime,
      validator: {
        identity: validatorsMap?.[unbonding.validatorAddress]?.identity,
        moniker: validatorsMap?.[unbonding.validatorAddress]?.moniker,
        validatorAddress: unbonding.validatorAddress,
      },
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

    data.redelegations = redelegations?.map<Redelegation>((redelegation) => ({
      balances: [
        coinToTokenWithValue(
          stakingParams.bondDenom,
          redelegation.balance,
          assetInfos,
          movePoolInfos
        ),
      ],
      completionTime: redelegation.completionTime,
      dstValidator: {
        identity: validatorsMap?.[redelegation.validatorDstAddress]?.identity,
        moniker: validatorsMap?.[redelegation.validatorDstAddress]?.moniker,
        validatorAddress: redelegation.validatorDstAddress,
      },
      srcValidator: {
        identity: validatorsMap?.[redelegation.validatorSrcAddress]?.identity,
        moniker: validatorsMap?.[redelegation.validatorSrcAddress]?.moniker,
        validatorAddress: redelegation.validatorSrcAddress,
      },
    }));

    data.rewards = rewards?.rewards.reduce<Record<string, TokenWithValue[]>>(
      (prev, redelegation) => ({
        ...prev,
        [redelegation.validatorAddress]:
          redelegation.reward.map<TokenWithValue>((coin) =>
            coinToTokenWithValue(
              coin.denom,
              coin.amount,
              assetInfos,
              movePoolInfos
            )
          ),
      }),
      {}
    );
    data.totalRewards = rewards?.total.reduce<Record<string, TokenWithValue>>(
      (total, reward) => ({
        ...total,
        [reward.denom]: coinToTokenWithValue(
          reward.denom,
          reward.amount,
          assetInfos,
          movePoolInfos
        ),
      }),
      {}
    );

    data.totalCommissions = commissions?.commission.reduce<
      Record<string, TokenWithValue>
    >(
      (total, commission) => ({
        ...total,
        [commission.denom]: coinToTokenWithValue(
          commission.denom,
          commission.amount,
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
