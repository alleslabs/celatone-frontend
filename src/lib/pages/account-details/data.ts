import { useCodeStore, useContractStore } from "lib/hooks";
import { useAccountBalances } from "lib/services/accountService";
import { useAssetInfos } from "lib/services/assetService";
import { useCodeListByWalletAddressPagination } from "lib/services/codeService";
import {
  useContractListByAdminPagination,
  useContractListByWalletAddressPagination,
} from "lib/services/contractService";
import type { BalanceWithAssetInfo, HumanAddr, Token, Option } from "lib/types";
import { formatTokenWithPrecision } from "lib/utils";
import { calculateAssetValue } from "lib/utils/assetValue";

export const useContractInstances = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
) => {
  const { data: contracts, isLoading } =
    useContractListByWalletAddressPagination(walletAddress, offset, pageSize);
  const { getContractLocalInfo } = useContractStore();
  const data = contracts?.map((contract) => {
    const localInfo = getContractLocalInfo(contract.contractAddress);

    return {
      ...contract,
      tags: localInfo?.tags,
      contractName: localInfo?.name,
    };
  });
  return {
    contracts: data,
    isLoading,
  };
};

export const useContractsAdmin = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
) => {
  const { data: contractsAdmin, isLoading } = useContractListByAdminPagination(
    walletAddress as HumanAddr,
    offset,
    pageSize
  );
  const { getContractLocalInfo } = useContractStore();

  const data = contractsAdmin?.map((contractAdmin) => {
    const localInfo = getContractLocalInfo(contractAdmin.contractAddress);

    return {
      ...contractAdmin,
      tags: localInfo?.tags,
      contractName: localInfo?.name,
    };
  });

  return {
    contracts: data,
    isLoading,
  };
};

export const useCodeStored = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
) => {
  const { data: codes, isLoading } = useCodeListByWalletAddressPagination(
    walletAddress as HumanAddr,
    offset,
    pageSize
  );
  const { getCodeLocalInfo } = useCodeStore();

  const data = codes?.map((code) => {
    const localInfo = getCodeLocalInfo(code.id);
    return {
      ...code,
      codeName: localInfo?.name,
    };
  });

  return {
    codes: data,
    isLoading,
  };
};

export const useUserAssetInfos = (walletAddress: Option<HumanAddr>) => {
  const { data: balances, isLoading } = useAccountBalances(walletAddress);
  const assetInfos = useAssetInfos();

  const contractBalancesWithAssetInfos = balances?.map(
    (balance): BalanceWithAssetInfo => ({
      balance,
      assetInfo: assetInfos?.[balance.id],
    })
  );

  // Supported assets should order by descending value
  const supportedAssets = contractBalancesWithAssetInfos
    ?.filter((balance) => balance.assetInfo)
    .sort((a, b) => {
      if (a.balance.price && b.balance.price) {
        return calculateAssetValue(
          formatTokenWithPrecision(
            b.balance.amount as Token,
            b.balance.precision
          ),
          b.balance.price
        )
          .sub(
            calculateAssetValue(
              formatTokenWithPrecision(
                a.balance.amount as Token,
                a.balance.precision
              ),
              a.balance.price
            )
          )
          .toNumber();
      }
      return 1;
    });

  const unsupportedAssets = contractBalancesWithAssetInfos?.filter(
    (balance) => !balance.assetInfo
  );

  return {
    supportedAssets,
    unsupportedAssets,
    isLoading,
  };
};
