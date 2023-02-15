import { useWallet } from "@cosmos-kit/react";

import { useCodeStore, useContractStore } from "lib/hooks";
import { useAccountBalance } from "lib/services/accountService";
import { useAssetInfos } from "lib/services/assetService";
import { useCodeListByWalletAddressWithPagination } from "lib/services/codeService";
import {
  useContractListByAdminWithPagination,
  useContractListByWalletAddressWithPagination,
} from "lib/services/contractService";
import type { BalanceWithAssetInfo, HumanAddr } from "lib/types";

export const useContractInstances = (offset: number, pageSize: number) => {
  const { address } = useWallet();
  const { data: contracts, isLoading } =
    useContractListByWalletAddressWithPagination(
      address as HumanAddr,
      offset,
      pageSize
    );
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

export const useContractsAdmin = (offset: number, pageSize: number) => {
  const { address } = useWallet();

  const { data: contractsAdmin, isLoading } =
    useContractListByAdminWithPagination(
      address as HumanAddr,
      offset,
      pageSize
    );
  const { getContractLocalInfo } = useContractStore();

  // eslint-disable-next-line sonarjs/no-identical-functions
  const data = contractsAdmin?.map((contract) => {
    const localInfo = getContractLocalInfo(contract.contractAddress);

    return {
      ...contract,
      tags: localInfo?.tags,
      contractName: localInfo?.name,
    };
  });

  return {
    contractsAdmin: data,
    isLoading,
  };
};

export const useCodeStored = (offset: number, pageSize: number) => {
  const { address } = useWallet();
  const { data: codes, isLoading } = useCodeListByWalletAddressWithPagination(
    address as HumanAddr,
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

export const useUserAssetInfos = () => {
  const { address } = useWallet();

  const { data: assets, isLoading } = useAccountBalance(address as HumanAddr);
  const assetInfos = useAssetInfos();

  const contractBalancesWithAssetInfos = assets
    ?.map(
      (balance): BalanceWithAssetInfo => ({
        balance,
        assetInfo: assetInfos?.[balance.id],
      })
    )
    .sort((a, b) => {
      if (a.balance.symbol && b.balance.symbol) {
        return a.balance.symbol.localeCompare(b.balance.symbol);
      }
      return -1;
    });

  const supportedAssets = contractBalancesWithAssetInfos?.filter(
    (balance) => balance.assetInfo
  );

  const unsupportedAssets = contractBalancesWithAssetInfos?.filter(
    (balance) => !balance.assetInfo
  );

  return {
    supportedAssets,
    unsupportedAssets,
    isLoading,
  };
};
