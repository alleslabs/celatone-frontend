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
import type { RawStakingParams, RawUnbonding } from "lib/services/delegation";
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
} from "lib/utils";
import { addrToValoper } from "lib/utils/bech32";

import type { TokenWithValue } from "./type";

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

export interface Unbonding
  extends Omit<RawUnbonding, "validatorAddress" | "amount"> {
  validator: ValidatorInfo;
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
  const { data: assetInfos } = useAssetInfos();

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
  bondedDenom: Option<string>,
  totalDelegations: Option<Record<string, TokenWithValue>>,
  totalUnbondings: Option<Record<string, TokenWithValue>>
) => {
  if (!bondedDenom || !totalDelegations || !totalUnbondings) return undefined;

  return Object.keys(totalDelegations).reduce(
    (total, denom) => ({
      ...total,
      [denom]: addTotal(totalUnbondings[denom], totalDelegations[denom]),
    }),
    {} as Record<string, TokenWithValue>
  );
};

export const useUserDelegationInfos = (walletAddress: HumanAddr) => {
  const { data: rawStakingParams } = useStakingParams();
  const { data: assetInfos } = useAssetInfos();
  const { data: validators } = useValidators();

  const { data: rawDelegations } = useDelegations(walletAddress);
  const { data: rawUnbondings } = useUnbondings(walletAddress);
  const { data: rawRewards } = useDelegationRewards(walletAddress);
  const { data: rawRedelegations } = useRedelegations(walletAddress);
  const { data: rawCommission } = useCommission(addrToValoper(walletAddress));

  if (!rawStakingParams || !assetInfos || !validators) return undefined;

  const stakingParams = {
    ...rawStakingParams,
    ...assetInfos[rawStakingParams.bondDenom],
  } as StakingParams;

  const isValidator = Object.keys(validators).includes(
    addrToValoper(walletAddress)
  );

  const delegations = rawDelegations?.map<Delegation>((raw) => ({
    validator: {
      validatorAddress: raw.validatorAddress,
      moniker:
        validators[raw.validatorAddress]?.moniker ?? raw.validatorAddress,
    },
    token: coinToTokenWithValue(raw.denom, raw.amount, assetInfos[raw.denom]),
  }));
  const totalDelegations = delegations?.reduce(
    (total, delegation) => ({
      ...total,
      [delegation.token.denom]: addTotal(
        total[delegation.token.denom],
        delegation.token
      ),
    }),
    {} as Record<string, TokenWithValue>
  );

  const unbondings = rawUnbondings?.map<Unbonding>((raw) => ({
    validator: {
      validatorAddress: raw.validatorAddress,
      moniker:
        validators[raw.validatorAddress]?.moniker ?? raw.validatorAddress,
    },
    completionTime: raw.completionTime,
    token: coinToTokenWithValue(
      rawStakingParams.bondDenom,
      raw.amount,
      assetInfos[rawStakingParams.bondDenom]
    ),
  }));
  const totalUnbondings = unbondings?.reduce(
    (total, unbonding) => ({
      ...total,
      [unbonding.token.denom]: addTotal(
        total[unbonding.token.denom],
        unbonding.token
      ),
    }),
    {} as Record<string, TokenWithValue>
  );

  const rewards = rawRewards?.rewards.reduce(
    (prev, raw) => ({
      ...prev,
      [raw.validatorAddress]: raw.reward.map<TokenWithValue>((coin) =>
        coinToTokenWithValue(coin.denom, coin.amount, assetInfos[coin.denom])
      ),
    }),
    {} as Record<string, TokenWithValue[]>
  );
  const totalRewards = rawRewards?.total.reduce(
    (total, raw) => ({
      ...total,
      [raw.denom]: coinToTokenWithValue(
        raw.denom,
        raw.amount,
        assetInfos[raw.denom]
      ),
    }),
    {} as Record<string, TokenWithValue>
  );

  const redelegations = rawRedelegations?.map<Redelegation>((raw) => ({
    ...raw,
    srcValidator: {
      validatorAddress: raw.srcValidatorAddress,
      moniker:
        validators[raw.srcValidatorAddress]?.moniker ?? raw.srcValidatorAddress,
    },
    dstValidator: {
      validatorAddress: raw.dstValidatorAddress,
      moniker:
        validators[raw.dstValidatorAddress]?.moniker ?? raw.srcValidatorAddress,
    },
    completionTime: raw.completionTime,
    token: coinToTokenWithValue(
      stakingParams.bondDenom,
      raw.amount,
      assetInfos[stakingParams.bondDenom]
    ),
  }));

  const totalCommission = rawCommission?.commission.reduce(
    (commission, raw) => ({
      ...commission,
      [raw.denom]: coinToTokenWithValue(
        raw.denom,
        raw.amount,
        assetInfos[raw.denom]
      ),
    }),
    {} as Record<string, TokenWithValue>
  );

  const totalBonded = calBonded(
    stakingParams?.bondDenom,
    totalDelegations,
    totalUnbondings
  );

  return {
    stakingParams,
    isValidator,
    totalBonded,
    totalDelegations,
    delegations,
    totalUnbondings,
    unbondings,
    totalRewards,
    rewards,
    redelegations,
    totalCommission,
  };
};

export const useAccountTotalValue = (walletAddress: HumanAddr) => {
  const { supportedAssets, isLoading } = useUserAssetInfos(walletAddress);
  const data = useUserDelegationInfos(walletAddress);
  if (isLoading || !data)
    return { totalAccountValue: undefined, isLoading: true };

  const { stakingParams, totalBonded, totalRewards, totalCommission } = data;
  if (!stakingParams || !totalBonded || !totalRewards || !totalCommission)
    return { totalAccountValue: undefined, isLoading: true };

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
