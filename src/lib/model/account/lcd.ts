import { useMemo } from "react";

import { useValidateAddress } from "lib/app-provider";
import { useAssetInfos } from "lib/services/assetService";
import {
  useCommissionsByValidatorAddressLcd,
  useDelegationRewardsByAddressLcd,
} from "lib/services/distribution";
import { useMovePoolInfos } from "lib/services/move";
import {
  useDelegationsByAddressLcd,
  useRedelegationsByAddressLcd,
  useStakingParamsLcd,
  useUnbondingsByAddressLcd,
} from "lib/services/staking";
import { useValidatorsLcd } from "lib/services/validator";
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
import {
  addrToValoper,
  addTokenWithValue,
  coinToTokenWithValue,
} from "lib/utils";

import type { DelegationInfos } from "./types";
import { calBonded } from "./utils";

export const useAccountDelegationInfosLcd = (
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

  const { data: stakingParams, isLoading: isStakingParamsLoading } =
    useStakingParamsLcd(enabled);
  const { data: delegations, isLoading: isDelegationsLoading } =
    useDelegationsByAddressLcd(address, enabled);
  const { data: unbondings, isLoading: isUnbondingsLoading } =
    useUnbondingsByAddressLcd(address, enabled);
  const { data: redelegations, isLoading: isRedelegationsLoading } =
    useRedelegationsByAddressLcd(address, enabled);
  const { data: rewards, isLoading: isRewardsLoading } =
    useDelegationRewardsByAddressLcd(address, enabled);

  const { data: commissions, isLoading: isCommissionsLoading } =
    useCommissionsByValidatorAddressLcd(valAddr, enabled);

  const { data: validators, isLoading: isValidatorsLoading } =
    useValidatorsLcd();
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
    isLoading,
    stakingParams: undefined,
    isValidator: undefined,
    isTotalBondedLoading: isDelegationsLoading || isUnbondingsLoading,
    totalBonded: undefined,
    isDelegationsLoading,
    totalDelegations: undefined,
    delegations: undefined,
    isUnbondingsLoading,
    totalUnbondings: undefined,
    unbondings: undefined,
    isRewardsLoading,
    totalRewards: undefined,
    rewards: undefined,
    isRedelegationsLoading,
    redelegations: undefined,
    isCommissionsLoading,
    totalCommissions: undefined,
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
      ({ delegation, balance }) => ({
        validator: {
          validatorAddress: delegation.validatorAddress,
          identity: validatorsMap?.[delegation.validatorAddress]?.identity,
          moniker: validatorsMap?.[delegation.validatorAddress]?.moniker,
        },
        balances: [
          coinToTokenWithValue(
            balance.denom,
            balance.amount,
            assetInfos,
            movePoolInfos
          ),
        ],
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
      validator: {
        validatorAddress: unbonding.validatorAddress,
        moniker: validatorsMap?.[unbonding.validatorAddress]?.moniker,
        identity: validatorsMap?.[unbonding.validatorAddress]?.identity,
      },
      completionTime: unbonding.completionTime,
      balances: [
        coinToTokenWithValue(
          stakingParams.bondDenom,
          unbonding.balance,
          assetInfos,
          movePoolInfos
        ),
      ],
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
      srcValidator: {
        validatorAddress: redelegation.validatorSrcAddress,
        moniker: validatorsMap?.[redelegation.validatorSrcAddress]?.moniker,
        identity: validatorsMap?.[redelegation.validatorSrcAddress]?.identity,
      },
      dstValidator: {
        validatorAddress: redelegation.validatorDstAddress,
        moniker: validatorsMap?.[redelegation.validatorDstAddress]?.moniker,
        identity: validatorsMap?.[redelegation.validatorDstAddress]?.identity,
      },
      completionTime: redelegation.completionTime,
      balances: [
        coinToTokenWithValue(
          stakingParams.bondDenom,
          redelegation.balance,
          assetInfos,
          movePoolInfos
        ),
      ],
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
