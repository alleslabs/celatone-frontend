import type { Big } from "big.js";
import big from "big.js";

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
import { useValidators } from "lib/services/validatorService";
import type {
  AssetInfo,
  BalanceWithAssetInfo,
  CodeInfo,
  ContractInfo,
  HumanAddr,
  Option,
  Token,
  U,
  USD,
  ValidatorInfo,
} from "lib/types";
import {
  calAssetValueWithPrecision,
  calculateAssetValue,
  calTotalValue,
  toToken,
  addrToValoper,
} from "lib/utils";

import type { TokenWithValue, UserDelegationsData } from "./type";

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

export interface StakingParams extends RawStakingParams {
  logo: Option<string>;
  precision: Option<number>;
}

export interface Delegation {
  validator: ValidatorInfo;
  token: TokenWithValue;
}

export interface Unbonding {
  validator: ValidatorInfo;
  completionTime: Date;
  token: TokenWithValue;
}

export interface Redelegation {
  srcValidator: ValidatorInfo;
  dstValidator: ValidatorInfo;
  completionTime: Date;
  token: TokenWithValue;
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
  const { assetInfos } = useAssetInfos();

  const contractBalancesWithAssetInfos = balances?.map<BalanceWithAssetInfo>(
    (balance): BalanceWithAssetInfo => ({
      balance,
      assetInfo: assetInfos?.[balance.id],
    })
  );

  // Supported assets should order by descending value
  const supportedAssets = contractBalancesWithAssetInfos
    ?.filter((balance) => balance.assetInfo)
    .sort((a, b) =>
      a.balance.price && b.balance.price
        ? calAssetValueWithPrecision(b.balance).cmp(
            calAssetValueWithPrecision(a.balance)
          )
        : 1
    );

  const unsupportedAssets = contractBalancesWithAssetInfos?.filter(
    (balance) => !balance.assetInfo
  );

  return {
    supportedAssets,
    unsupportedAssets,
    isLoading,
    totalData: contractBalancesWithAssetInfos?.length,
    error: error as Error,
  };
};

const coinToTokenWithValue = (
  denom: string,
  amount: string,
  assetInfo: Option<AssetInfo>
): TokenWithValue => {
  const token: TokenWithValue = {
    denom,
    amount: big(amount) as U<Token<Big>>,
    logo: undefined,
    precision: undefined,
    value: undefined,
  };
  return assetInfo
    ? Object.assign<TokenWithValue, Omit<TokenWithValue, "denom" | "amount">>(
        token,
        {
          logo: assetInfo.logo,
          precision: assetInfo.precision,
          value: calculateAssetValue(
            toToken(token.amount, assetInfo.precision),
            assetInfo.price as USD<number>
          ),
        }
      )
    : token;
};

const addTotal = (
  oldTotal: Option<TokenWithValue>,
  token: TokenWithValue
): TokenWithValue =>
  !oldTotal
    ? token
    : {
        ...oldTotal,
        amount: oldTotal.amount.add(token.amount) as U<Token<Big>>,
        value: oldTotal.value?.add(token.value ?? 0) as USD<Big>,
      };

const calBonded = (
  totalDelegations: Option<Record<string, TokenWithValue>>,
  totalUnbondings: Option<Record<string, TokenWithValue>>
) => {
  if (!totalDelegations || !totalUnbondings) return undefined;

  return Object.keys(totalDelegations).reduce<Record<string, TokenWithValue>>(
    (total, denom) => ({
      ...total,
      [denom]: addTotal(totalUnbondings[denom], totalDelegations[denom]),
    }),
    {}
  );
};

export const useUserDelegationInfos = (walletAddress: HumanAddr) => {
  const { data: rawStakingParams, isLoading: isLoadingRawStakingParams } =
    useStakingParams();
  const { assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos();
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
    isLoadingRawStakingParams || isLoadingAssetInfos || isLoadingValidators;
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
    const stakingParams = {
      ...rawStakingParams,
      logo: assetInfos[rawStakingParams.bondDenom].logo,
      precision: assetInfos[rawStakingParams.bondDenom].precision,
    };
    data.stakingParams = stakingParams;

    data.isValidator = Object.keys(validators).includes(
      addrToValoper(walletAddress)
    );

    data.delegations = rawDelegations?.map<Delegation>((raw) => ({
      validator: {
        validatorAddress: raw.validatorAddress,
        moniker: validators[raw.validatorAddress]?.moniker,
      },
      token: coinToTokenWithValue(raw.denom, raw.amount, assetInfos[raw.denom]),
    }));
    data.totalDelegations = data.delegations?.reduce<
      Record<string, TokenWithValue>
    >(
      (total, delegation) => ({
        ...total,
        [delegation.token.denom]: addTotal(
          total[delegation.token.denom],
          delegation.token
        ),
      }),
      {}
    );

    data.unbondings = rawUnbondings?.map<Unbonding>((raw) => ({
      validator: {
        validatorAddress: raw.validatorAddress,
        moniker: validators[raw.validatorAddress]?.moniker,
      },
      completionTime: raw.completionTime,
      token: coinToTokenWithValue(
        rawStakingParams.bondDenom,
        raw.amount,
        assetInfos[rawStakingParams.bondDenom]
      ),
    }));
    data.totalUnbondings = data.unbondings?.reduce<
      Record<string, TokenWithValue>
    >(
      (total, unbonding) => ({
        ...total,
        [unbonding.token.denom]: addTotal(
          total[unbonding.token.denom],
          unbonding.token
        ),
      }),
      {}
    );

    data.rewards = rawRewards?.rewards.reduce<Record<string, TokenWithValue[]>>(
      (prev, raw) => ({
        ...prev,
        [raw.validatorAddress]: raw.reward.map<TokenWithValue>((coin) =>
          coinToTokenWithValue(coin.denom, coin.amount, assetInfos[coin.denom])
        ),
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
          assetInfos[raw.denom]
        ),
      }),
      {}
    );

    data.redelegations = rawRedelegations?.map<Redelegation>((raw) => ({
      srcValidator: {
        validatorAddress: raw.srcValidatorAddress,
        moniker: validators[raw.srcValidatorAddress]?.moniker,
      },
      dstValidator: {
        validatorAddress: raw.dstValidatorAddress,
        moniker: validators[raw.dstValidatorAddress]?.moniker,
      },
      completionTime: raw.completionTime,
      token: coinToTokenWithValue(
        stakingParams.bondDenom,
        raw.amount,
        assetInfos[stakingParams.bondDenom]
      ),
    }));

    data.totalCommission = rawCommission?.commission.reduce<
      Record<string, TokenWithValue>
    >(
      (commission, raw) => ({
        ...commission,
        [raw.denom]: coinToTokenWithValue(
          raw.denom,
          raw.amount,
          assetInfos[raw.denom]
        ),
      }),
      {}
    );

    data.totalBonded = calBonded(data.totalDelegations, data.totalUnbondings);
  }

  return data;
};

export const useAccountTotalValue = (walletAddress: HumanAddr) => {
  const { supportedAssets, isLoading } = useUserAssetInfos(walletAddress);
  const data = useUserDelegationInfos(walletAddress);
  if (isLoading || !data)
    return { totalAccountValue: undefined, isLoading: true };

  const {
    stakingParams,
    isLoading: isLoadingStakingParams,
    totalBonded,
    isLoadingTotalBonded,
    totalRewards,
    isLoadingRewards,
    totalCommission,
    isLoadingTotalCommission,
  } = data;
  if (
    isLoadingStakingParams ||
    isLoadingTotalBonded ||
    isLoadingRewards ||
    isLoadingTotalCommission
  )
    return { totalAccountValue: undefined, isLoading: true };

  if (!stakingParams || !totalBonded || !totalRewards || !totalCommission)
    return { totalAccountValue: undefined, isLoading: false };

  const defaultValue = big(0) as USD<Big>;

  const totalAssetValue = supportedAssets
    ? calTotalValue(supportedAssets)
    : defaultValue;
  return {
    totalAccountValue: totalAssetValue
      .add(totalBonded[stakingParams.bondDenom]?.value ?? defaultValue)
      .add(totalRewards[stakingParams.bondDenom]?.value ?? defaultValue)
      .add(
        totalCommission[stakingParams.bondDenom]?.value ?? defaultValue
      ) as USD<Big>,
    isLoading: false,
  };
};
