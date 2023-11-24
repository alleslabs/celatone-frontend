import type { Big } from "big.js";
import big from "big.js";
import { isUndefined } from "lodash";

import { useCelatoneApp } from "lib/app-provider";
import { useCodeStore, useContractStore } from "lib/providers/store";
import { useAccountBalances } from "lib/services/accountService";
import { useAssetInfos } from "lib/services/assetService";
import { useCodeListByWalletAddressPagination } from "lib/services/codeService";
import {
  useContractListByAdminPagination,
  useContractListByWalletAddressPagination,
} from "lib/services/contractService";
import type { RawStakingParams } from "lib/services/delegation";
import {
  useCommission,
  useDelegationRewards,
  useDelegations,
  useRedelegations,
  useStakingParams,
  useUnbondings,
} from "lib/services/delegationService";
import { useLPShareInfo } from "lib/services/poolService";
import { useValidators } from "lib/services/validatorService";
import type {
  BalanceWithAssetInfo,
  CodeInfo,
  ContractInfo,
  HumanAddr,
  Option,
  TokenWithValue,
  USD,
  ValidatorInfo,
} from "lib/types";
import {
  calAssetValueWithPrecision,
  calTotalValue,
  addrToValoper,
  addTokenWithValue,
  coinToTokenWithValue,
  totalValueTokenWithValue,
  compareTokenWithValues,
} from "lib/utils";

import type { UserDelegationsData } from "./types";

interface AccountContracts {
  contracts: Option<ContractInfo[]>;
  isLoading: boolean;
}

interface AccountCodes {
  codes: Option<CodeInfo[]>;
  isLoading: boolean;
}

interface AccountAssetInfos {
  supportedAssets: Option<BalanceWithAssetInfo[]>;
  unsupportedAssets: Option<BalanceWithAssetInfo[]>;
  isLoading: boolean;
  totalData: Option<number>;
  error: Error;
}

export interface StakingParams extends Omit<RawStakingParams, "bondDenoms"> {
  bondDenoms: TokenWithValue[];
}

export interface Delegation {
  validator: ValidatorInfo;
  balances: TokenWithValue[];
}

export interface Unbonding {
  validator: ValidatorInfo;
  completionTime: Date;
  balances: TokenWithValue[];
}

export interface Redelegation {
  srcValidator: ValidatorInfo;
  dstValidator: ValidatorInfo;
  completionTime: Date;
  balances: TokenWithValue[];
}

export const useAccountContracts = (
  walletAddress: HumanAddr,
  offset: number,
  pageSize: number
): AccountContracts => {
  const { data: contracts, isLoading } =
    useContractListByWalletAddressPagination(walletAddress, offset, pageSize);
  const { getContractLocalInfo } = useContractStore();
  const data = contracts?.map<ContractInfo>((contract) => {
    const localInfo = getContractLocalInfo(contract.contractAddress);

    return {
      ...contract,
      name: localInfo?.name,
      description: localInfo?.description,
      tags: localInfo?.tags,
      lists: localInfo?.lists,
    };
  });
  return {
    contracts: data,
    isLoading,
  };
};

export const useAccountAdminContracts = (
  walletAddress: HumanAddr,
  offset: number,
  pageSize: number
): AccountContracts => {
  const { data: contractsAdmin, isLoading } = useContractListByAdminPagination(
    walletAddress as HumanAddr,
    offset,
    pageSize
  );
  const { getContractLocalInfo } = useContractStore();

  const data = contractsAdmin?.map<ContractInfo>((contractAdmin) => {
    const localInfo = getContractLocalInfo(contractAdmin.contractAddress);

    return {
      ...contractAdmin,
      name: localInfo?.name,
      description: localInfo?.description,
      tags: localInfo?.tags,
      lists: localInfo?.lists,
    };
  });

  return {
    contracts: data,
    isLoading,
  };
};

export const useAccountCodes = (
  walletAddress: HumanAddr,
  offset: number,
  pageSize: number
): AccountCodes => {
  const { data: codes, isLoading } = useCodeListByWalletAddressPagination(
    walletAddress as HumanAddr,
    offset,
    pageSize
  );
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();

  const data = codes?.map<CodeInfo>((code) => ({
    ...code,
    name: getCodeLocalInfo(code.id)?.name,
    isSaved: isCodeIdSaved(code.id),
  }));

  return {
    codes: data,
    isLoading,
  };
};

export const useUserAssetInfos = (
  walletAddress: HumanAddr
): AccountAssetInfos => {
  const {
    data: balances,
    isLoading,
    error,
  } = useAccountBalances(walletAddress);
  const { data: assetInfos } = useAssetInfos({ withPrices: true });
  const { data: lpMap } = useLPShareInfo();

  const contractBalancesWithAssetInfos = balances
    ?.filter((bal) => Number(bal.amount))
    .map<BalanceWithAssetInfo>((balance): BalanceWithAssetInfo => {
      const assetInfo = assetInfos?.[balance.id];
      const lpDetails = lpMap?.[balance.id];
      return lpDetails
        ? {
            balance: {
              ...balance,
              price: lpDetails.lpPricePerShare.toNumber(),
              symbol: lpDetails.symbol,
              precision: lpDetails.precision,
            },
            assetInfo,
            isLPToken: true,
            lpLogo: lpDetails.image,
          }
        : {
            balance,
            assetInfo,
            isLPToken: false,
          };
    });

  // Supported assets should order by descending value
  const supportedAssets = contractBalancesWithAssetInfos
    ?.filter(
      (balance) =>
        !isUndefined(balance.assetInfo) ||
        !isUndefined(lpMap?.[balance.balance.id])
    )
    .sort((a, b) =>
      !isUndefined(a.balance.price) && !isUndefined(b.balance.price)
        ? calAssetValueWithPrecision(b.balance).cmp(
            calAssetValueWithPrecision(a.balance)
          )
        : 1
    );

  const unsupportedAssets = contractBalancesWithAssetInfos?.filter(
    (balance) =>
      isUndefined(balance.assetInfo) && isUndefined(lpMap?.[balance.balance.id])
  );

  return {
    supportedAssets,
    unsupportedAssets,
    isLoading,
    totalData: contractBalancesWithAssetInfos?.length,
    error: error as Error,
  };
};

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

export const useUserDelegationInfos = (walletAddress: HumanAddr) => {
  const { data: rawStakingParams, isLoading: isLoadingRawStakingParams } =
    useStakingParams();
  const { data: lpMap, isFetching: isLpMapFetching } = useLPShareInfo();
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: validators, isLoading: isLoadingValidators } = useValidators();

  const { data: rawDelegations, isLoading: isLoadingRawDelegations } =
    useDelegations(walletAddress);
  const { data: rawUnbondings, isLoading: isLoadingRawUnbondings } =
    useUnbondings(walletAddress);
  const { data: rawRewards, isLoading: isLoadingRawRewards } =
    useDelegationRewards(walletAddress);
  const { data: rawRedelegations, isLoading: isLoadingRawRedelegations } =
    useRedelegations(walletAddress);
  const { data: rawCommission, isLoading: isLoadingRawCommission } =
    useCommission(addrToValoper(walletAddress));

  const isLoading =
    isLoadingRawStakingParams ||
    isLoadingAssetInfos ||
    isLoadingValidators ||
    isLpMapFetching;

  const data: UserDelegationsData = {
    stakingParams: undefined,
    isValidator: undefined,
    isLoading,
    totalBonded: undefined,
    isLoadingTotalBonded: isLoadingRawDelegations || isLoadingRawUnbondings,
    totalDelegations: undefined,
    delegations: undefined,
    isLoadingDelegations: isLoadingRawDelegations,
    totalUnbondings: undefined,
    unbondings: undefined,
    isLoadingUnbondings: isLoadingRawUnbondings,
    totalRewards: undefined,
    rewards: undefined,
    isLoadingRewards: isLoadingRawRewards,
    redelegations: undefined,
    isLoadingRedelegations: isLoadingRawRedelegations,
    totalCommission: undefined,
    isLoadingTotalCommission: isLoadingRawCommission,
  };

  if (rawStakingParams && assetInfos && validators) {
    data.stakingParams = {
      ...rawStakingParams,
      bondDenoms: rawStakingParams.bondDenoms.map((denom) =>
        coinToTokenWithValue(denom, "0", assetInfos, lpMap)
      ),
    };

    data.isValidator = Object.keys(validators).includes(
      addrToValoper(walletAddress)
    );

    data.delegations = rawDelegations?.map<Delegation>((raw) => ({
      validator: {
        validatorAddress: raw.validatorAddress,
        moniker: validators[raw.validatorAddress]?.moniker,
        identity: validators[raw.validatorAddress]?.identity,
      },
      balances: raw.balance
        .map((coin) =>
          coinToTokenWithValue(coin.denom, coin.amount, assetInfos, lpMap)
        )
        .sort(compareTokenWithValues),
    }));
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

    data.unbondings = rawUnbondings?.map<Unbonding>((raw) => ({
      validator: {
        validatorAddress: raw.validatorAddress,
        moniker: validators[raw.validatorAddress]?.moniker,
        identity: validators[raw.validatorAddress]?.identity,
      },
      completionTime: raw.completionTime,
      balances: raw.balance
        .map((coin) =>
          coinToTokenWithValue(coin.denom, coin.amount, assetInfos, lpMap)
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

    data.rewards = rawRewards?.rewards.reduce<Record<string, TokenWithValue[]>>(
      (prev, raw) => ({
        ...prev,
        [raw.validatorAddress]: raw.reward
          .map<TokenWithValue>((coin) =>
            coinToTokenWithValue(coin.denom, coin.amount, assetInfos, lpMap)
          )
          .sort(compareTokenWithValues),
      }),
      {}
    );
    data.totalRewards = rawRewards?.total.reduce<
      Record<string, TokenWithValue>
    >(
      (total, raw) => ({
        ...total,
        [raw.denom]: coinToTokenWithValue(
          raw.denom,
          raw.amount,
          assetInfos,
          lpMap
        ),
      }),
      {}
    );

    data.redelegations = rawRedelegations?.map<Redelegation>((raw) => ({
      srcValidator: {
        validatorAddress: raw.srcValidatorAddress,
        moniker: validators[raw.srcValidatorAddress]?.moniker,
        identity: validators[raw.srcValidatorAddress]?.identity,
      },
      dstValidator: {
        validatorAddress: raw.dstValidatorAddress,
        moniker: validators[raw.dstValidatorAddress]?.moniker,
        identity: validators[raw.dstValidatorAddress]?.identity,
      },
      completionTime: raw.completionTime,
      balances: raw.balance
        .map((coin) =>
          coinToTokenWithValue(coin.denom, coin.amount, assetInfos, lpMap)
        )
        .sort(compareTokenWithValues),
    }));

    data.totalCommission = rawCommission?.commission.reduce<
      Record<string, TokenWithValue>
    >(
      (commission, raw) => ({
        ...commission,
        [raw.denom]: coinToTokenWithValue(
          raw.denom,
          raw.amount,
          assetInfos,
          lpMap
        ),
      }),
      {}
    );

    data.totalBonded = calBonded(data.totalDelegations, data.totalUnbondings);
  }

  return data;
};

export const useAccountTotalValue = (walletAddress: HumanAddr) => {
  const {
    chainConfig: {
      extra: { disableDelegation },
    },
  } = useCelatoneApp();
  const { supportedAssets, isLoading } = useUserAssetInfos(walletAddress);
  const {
    stakingParams,
    isLoading: isLoadingStakingParams,
    totalBonded,
    isLoadingTotalBonded,
    totalRewards,
    isLoadingRewards,
    totalCommission,
    isLoadingTotalCommission,
  } = useUserDelegationInfos(walletAddress);

  const defaultValue = big(0) as USD<Big>;

  const totalAssetValue = supportedAssets
    ? calTotalValue(supportedAssets)
    : defaultValue;

  if (disableDelegation)
    return { totalAccountValue: totalAssetValue, isLoading: false };

  if (
    isLoading ||
    isLoadingStakingParams ||
    isLoadingStakingParams ||
    isLoadingTotalBonded ||
    isLoadingRewards ||
    isLoadingTotalCommission
  )
    return { totalAccountValue: undefined, isLoading: true };

  if (!stakingParams || !totalBonded || !totalRewards || !totalCommission)
    return { totalAccountValue: undefined, isLoading: false };

  return {
    totalAccountValue: totalAssetValue
      .add(totalValueTokenWithValue(totalBonded, defaultValue))
      .add(totalValueTokenWithValue(totalRewards, defaultValue))
      .add(totalValueTokenWithValue(totalCommission, defaultValue)) as USD<Big>,
    isLoading: false,
  };
};
