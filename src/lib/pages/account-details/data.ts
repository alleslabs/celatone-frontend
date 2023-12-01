import type { Big } from "big.js";
import big from "big.js";

import { useCelatoneApp } from "lib/app-provider";
import { useCodeStore, useContractStore } from "lib/providers/store";
import { useAssetInfos } from "lib/services/assetService";
import { useBalances } from "lib/services/balanceService";
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
import { useMovePoolInfos } from "lib/services/move";
import { useValidators } from "lib/services/validatorService";
import type {
  Addr,
  CodeInfo,
  ContractInfo,
  HumanAddr,
  Option,
  TokenWithValue,
  USD,
  Validator,
} from "lib/types";
import {
  addrToValoper,
  addTokenWithValue,
  coinToTokenWithValue,
  totalValueTokenWithValue,
  compareTokenWithValues,
  filterSupportedTokens,
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
  supportedAssets: Option<TokenWithValue[]>;
  totalSupportedAssetsValue: Option<USD<Big>>;
  unsupportedAssets: Option<TokenWithValue[]>;
  isLoading: boolean;
  totalData: Option<number>;
  error: Error;
}

export interface StakingParams extends Omit<RawStakingParams, "bondDenoms"> {
  bondDenoms: TokenWithValue[];
}

export interface Delegation {
  validator: Validator;
  balances: TokenWithValue[];
}

export interface Unbonding {
  validator: Validator;
  completionTime: Date;
  balances: TokenWithValue[];
}

export interface Redelegation {
  srcValidator: Validator;
  dstValidator: Validator;
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

export const useUserAssetInfos = (address: Addr): AccountAssetInfos => {
  const { data: accountBalances, isLoading, error } = useBalances(address);
  const { data: assetInfos } = useAssetInfos({ withPrices: true });
  const { data: movePoolInfos } = useMovePoolInfos();

  const balances = accountBalances?.map<TokenWithValue>((balance) =>
    coinToTokenWithValue(
      balance.denom,
      balance.amount,
      assetInfos,
      movePoolInfos
    )
  );

  // Supported assets should order by descending value
  const {
    supportedTokens: supportedAssets,
    unsupportedTokens: unsupportedAssets,
  } = filterSupportedTokens(balances);
  const totalSupportedAssetsValue = supportedAssets
    ? totalValueTokenWithValue(supportedAssets, big(0) as USD<Big>)
    : undefined;

  return {
    supportedAssets,
    totalSupportedAssetsValue,
    unsupportedAssets,
    isLoading,
    totalData: balances?.length,
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

export const useUserDelegationInfos = (address: Addr) => {
  const { data: rawStakingParams, isLoading: isLoadingRawStakingParams } =
    useStakingParams();
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: lpMap, isFetching: isLpMapFetching } = useMovePoolInfos();
  const { data: validators, isLoading: isLoadingValidators } = useValidators();

  const { data: rawDelegations, isLoading: isLoadingRawDelegations } =
    useDelegations(address);
  const { data: rawUnbondings, isLoading: isLoadingRawUnbondings } =
    useUnbondings(address);
  const { data: rawRewards, isLoading: isLoadingRawRewards } =
    useDelegationRewards(address);
  const { data: rawRedelegations, isLoading: isLoadingRawRedelegations } =
    useRedelegations(address);
  const { data: rawCommission, isLoading: isLoadingRawCommission } =
    useCommission(addrToValoper(address as HumanAddr));

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
      addrToValoper(address as HumanAddr)
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

export const useAccountTotalValue = (address: Addr) => {
  const defaultValue = big(0) as USD<Big>;

  const {
    chainConfig: {
      extra: { disableDelegation },
    },
  } = useCelatoneApp();
  const { totalSupportedAssetsValue = defaultValue, isLoading } =
    useUserAssetInfos(address);
  const {
    stakingParams,
    isLoading: isLoadingStakingParams,
    totalBonded,
    isLoadingTotalBonded,
    totalRewards,
    isLoadingRewards,
    totalCommission,
    isLoadingTotalCommission,
  } = useUserDelegationInfos(address);

  if (disableDelegation)
    return {
      totalAccountValue: totalSupportedAssetsValue,
      isLoading: false,
    };

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
    totalAccountValue: totalSupportedAssetsValue
      .add(totalValueTokenWithValue(totalBonded, defaultValue))
      .add(totalValueTokenWithValue(totalRewards, defaultValue))
      .add(totalValueTokenWithValue(totalCommission, defaultValue)) as USD<Big>,
    isLoading: false,
  };
};
