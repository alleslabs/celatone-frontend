import type { Big } from "big.js";
import big from "big.js";

import { useCelatoneApp } from "lib/app-provider";
import { useCodeStore, useContractStore } from "lib/providers/store";
import { useAccountTableCounts } from "lib/services/accountService";
import { useAssetInfos } from "lib/services/assetService";
import { useBalanceInfos, useBalances } from "lib/services/balanceService";
import { useCodesByAddress } from "lib/services/codeService";
import {
  useAdminContractsByAddress,
  useInstantiatedContractsByAddress,
} from "lib/services/contractService";
import { useDelegationsByAddress } from "lib/services/delegationService";
import { useMovePoolInfos } from "lib/services/move";
import type {
  BechAddr,
  CodeInfo,
  ContractInfo,
  Nullish,
  Option,
  TokenWithValue,
  USD,
} from "lib/types";
import {
  addTokenWithValue,
  coinToTokenWithValue,
  totalValueTokenWithValue,
  compareTokenWithValues,
} from "lib/utils";

import type {
  Delegation,
  Redelegation,
  StakingParams,
  Unbonding,
} from "./types";

// ------------------------------------------//
// ---------------TABLE COUNTS---------------//
// ------------------------------------------//

interface AccountDetailsTableCounts {
  tableCounts: {
    codesCount: Nullish<number>;
    contractsAdminCount: Nullish<number>;
    contractsCount: Nullish<number>;
    txsCount: Nullish<number>;
    proposalsCount: Nullish<number>;
    assetsCount: Option<number>;
  };
  isLoading: boolean;
  refetchCounts: () => void;
}

export const useAccountDetailsTableCounts = (
  address: BechAddr
): AccountDetailsTableCounts => {
  const {
    data,
    refetch,
    isLoading: isLoadingAccountTableCounts,
  } = useAccountTableCounts(address);
  const { data: balances, isLoading: isBalancesLoading } = useBalances(address);

  return {
    tableCounts: {
      codesCount: data?.code,
      contractsAdminCount: data?.contractByAdmin,
      contractsCount: data?.instantiated,
      txsCount: data?.tx,
      proposalsCount: data?.proposal,
      assetsCount: balances?.length,
    },
    isLoading: isLoadingAccountTableCounts || isBalancesLoading,
    refetchCounts: refetch,
  };
};

// ------------------------------------------//
// -----------------CONTRACTS----------------//
// ------------------------------------------//

interface AccountContracts {
  contracts: Option<ContractInfo[]>;
  isLoading: boolean;
}

export const useAccountContracts = (
  walletAddress: BechAddr,
  offset: number,
  limit: number
): AccountContracts => {
  const { data: contracts, isLoading } = useInstantiatedContractsByAddress(
    walletAddress,
    limit,
    offset
  );
  const { getContractLocalInfo } = useContractStore();
  const data = contracts?.items?.map<ContractInfo>((contract) => {
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
  walletAddress: BechAddr,
  offset: number,
  pageSize: number
): AccountContracts => {
  const { data: contractsAdmin, isLoading } = useAdminContractsByAddress(
    walletAddress,
    pageSize,
    offset
  );
  const { getContractLocalInfo } = useContractStore();

  const data = contractsAdmin?.items?.map<ContractInfo>((contractAdmin) => {
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

// ------------------------------------------//
// -------------------CODES------------------//
// ------------------------------------------//

interface AccountCodes {
  codes: Option<CodeInfo[]>;
  isLoading: boolean;
}

export const useAccountCodes = (
  walletAddress: BechAddr,
  offset: number,
  limit: number
): AccountCodes => {
  const { data: codes, isLoading } = useCodesByAddress(
    walletAddress,
    limit,
    offset
  );

  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();

  const data = codes?.items?.map<CodeInfo>((code) => ({
    ...code,
    name: getCodeLocalInfo(code.id)?.name,
    isSaved: isCodeIdSaved(code.id),
  }));

  return {
    codes: data,
    isLoading,
  };
};

// ------------------------------------------//
// ----------------DELEGATIONS---------------//
// ------------------------------------------//

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

export const useUserDelegationInfos = (address: BechAddr) => {
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: lpMap, isLoading: isLpMapLoading } = useMovePoolInfos();

  const { data: accountDelegations, isLoading: isLoadingAccountDelegations } =
    useDelegationsByAddress(address);

  const isLoading =
    isLoadingAccountDelegations || isLoadingAssetInfos || isLpMapLoading;

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
      bondDenoms: accountDelegations.stakingParams.bondDenoms.map((denom) =>
        coinToTokenWithValue(denom, "0", assetInfos, lpMap)
      ),
    };

    data.isValidator = accountDelegations.isValidator;

    data.delegations = accountDelegations.delegations.map<Delegation>(
      (raw) => ({
        validator: raw.validator,
        balances: raw.balance
          .map((coin) =>
            coinToTokenWithValue(coin.denom, coin.amount, assetInfos, lpMap)
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

    data.rewards = accountDelegations.delegationRewards.rewards.reduce<
      Record<string, TokenWithValue[]>
    >(
      (prev, raw) => ({
        ...prev,
        [raw.validator.validatorAddress]: raw.reward
          .map<TokenWithValue>((coin) =>
            coinToTokenWithValue(coin.denom, coin.amount, assetInfos, lpMap)
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
          lpMap
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
            coinToTokenWithValue(coin.denom, coin.amount, assetInfos, lpMap)
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
          lpMap
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

  const {
    chainConfig: {
      extra: { disableDelegation },
    },
  } = useCelatoneApp();
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
  } = useUserDelegationInfos(address);

  if (disableDelegation)
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
