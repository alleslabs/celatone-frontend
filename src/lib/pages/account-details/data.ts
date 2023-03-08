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
import type { RawUnbonding } from "lib/services/delegation";
import {
  useCommission,
  useDelegationRewards,
  useDelegations,
  useStakingParams,
  useUnbondings,
} from "lib/services/delegationService";
import type {
  AssetInfo,
  BalanceWithAssetInfo,
  CodeInfo,
  ContractInfo,
  HumanAddr,
  Option,
  Token,
  TokenWithValue,
  U,
  USD,
  ValidatorAddr,
} from "lib/types";
import {
  calAssetValueWithPrecision,
  calculateAssetValue,
  toToken,
} from "lib/utils";
import { addrToValoper } from "lib/utils/bech32";

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

interface Delegation {
  validatorAddress: ValidatorAddr;
  token: TokenWithValue;
}

interface Unbonding extends Omit<RawUnbonding, "amount"> {
  token: TokenWithValue;
}

interface Reward {
  validatorAddress: ValidatorAddr;
  tokens: TokenWithValue[];
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
    uAmount: big(amount) as U<Token<Big>>,
    amount: undefined,
    value: undefined,
  };
  if (assetInfo) {
    token.amount = toToken(amount as U<Token>, assetInfo.precision);
    token.value = calculateAssetValue(
      token.amount,
      assetInfo.price as USD<number>
    );
  }

  return token;
};

const addTotal = (
  oldTotal: Option<TokenWithValue>,
  token: TokenWithValue
): TokenWithValue => {
  if (!oldTotal) return token;

  return {
    denom: oldTotal.denom,
    uAmount: oldTotal.uAmount.add(token.uAmount) as U<Token<Big>>,
    amount: oldTotal.amount?.add(token.amount ?? big(0)) as Token<Big>,
    value: oldTotal.value?.add(token.value ?? 0) as USD<Big>,
  };
};

export const useUserDelegationInfos = async (walletAddress: HumanAddr) => {
  const { data: stakingParams, isLoading: isLoadingStakingParams } =
    useStakingParams();
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos();

  const { data: rawDelegations, isLoading: isLoadingDelegations } =
    useDelegations(walletAddress);
  const { data: rawUnbondings, isLoading: isLoadingUnbondings } =
    useUnbondings(walletAddress);
  const { data: rawRewards, isLoading: isLoadingRewards } =
    useDelegationRewards(walletAddress);
  const { data: rawCommission, isLoading: isLoadingCommission } = useCommission(
    addrToValoper(walletAddress)
  );

  const delegations =
    assetInfos && rawDelegations
      ? rawDelegations.map<Delegation>((raw) => ({
          validatorAddress: raw.validatorAddress,
          token: coinToTokenWithValue(
            raw.denom,
            raw.amount,
            assetInfos[raw.denom]
          ),
        }))
      : undefined;
  const totalDelegations: Record<string, TokenWithValue> =
    delegations?.reduce(
      (total, delegation) => ({
        ...total,
        [delegation.token.denom]: addTotal(
          total[delegation.token.denom],
          delegation.token
        ),
      }),
      {} as Record<string, TokenWithValue>
    ) ?? {};

  const unbondings =
    stakingParams && assetInfos && rawUnbondings
      ? rawUnbondings.map<Unbonding>((raw) => ({
          validatorAddress: raw.validatorAddress,
          completionTime: raw.completionTime,
          token: coinToTokenWithValue(
            stakingParams.bondDenom,
            raw.amount,
            assetInfos[stakingParams.bondDenom]
          ),
        }))
      : undefined;
  const totalUnbondings: Record<string, TokenWithValue> =
    unbondings?.reduce(
      (total, unbonding) => ({
        ...total,
        [unbonding.token.denom]: addTotal(
          total[unbonding.token.denom],
          unbonding.token
        ),
      }),
      {} as Record<string, TokenWithValue>
    ) ?? {};

  const rewards =
    assetInfos && rawRewards
      ? rawRewards.rewards.map<Reward>((raw) => ({
          validatorAddress: raw.validatorAddress,
          tokens: raw.reward.map<TokenWithValue>((coin) =>
            coinToTokenWithValue(
              coin.denom,
              coin.amount,
              assetInfos[coin.denom]
            )
          ),
        }))
      : undefined;
  const totalRewards: Record<string, TokenWithValue> =
    assetInfos && rawRewards
      ? rawRewards.total.reduce(
          (total, raw) => ({
            ...total,
            [raw.denom]: coinToTokenWithValue(
              raw.denom,
              raw.amount,
              assetInfos[raw.denom]
            ),
          }),
          {} as Record<string, TokenWithValue>
        )
      : {};

  const totalCommission: Record<string, TokenWithValue> =
    assetInfos && rawCommission
      ? rawCommission.commission.reduce(
          (commission, raw) => ({
            ...commission,
            [raw.denom]: coinToTokenWithValue(
              raw.denom,
              raw.amount,
              assetInfos[raw.denom]
            ),
          }),
          {} as Record<string, TokenWithValue>
        )
      : {};

  return {
    stakingParams,
    isLoadingStakingParams,
    assetInfos,
    isLoadingAssetInfos,
    totalDelegations,
    delegations,
    isLoadingDelegations,
    totalUnbondings,
    unbondings,
    isLoadingUnbondings,
    totalRewards,
    rewards,
    isLoadingRewards,
    totalCommission,
    isLoadingCommission,
  };
};
