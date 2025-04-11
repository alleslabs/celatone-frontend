import type {
  BechAddr,
  CodeInfo,
  ContractInfo,
  Nullish,
  Option,
} from "lib/types";

import { useTierConfig } from "lib/app-provider";
import { useCodeStore, useContractStore } from "lib/providers/store";
import { useAccountTableCounts } from "lib/services/account";
import { useBalances } from "lib/services/bank";
import { useCodesByAddress } from "lib/services/wasm/code";
import {
  useAdminContractsByAddress,
  useInstantiatedContractsByAddress,
  useInstantiatedContractsByAddressRest,
} from "lib/services/wasm/contract";

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
  const { isFullTier } = useTierConfig();
  const {
    data,
    refetch,
    isLoading: isLoadingAccountTableCounts,
  } = useAccountTableCounts(address, { enabled: isFullTier });
  const { data: balances, isLoading: isBalancesLoading } = useBalances(address);

  if (!isFullTier) {
    return {
      tableCounts: {
        codesCount: undefined,
        contractsAdminCount: undefined,
        contractsCount: undefined,
        txsCount: undefined,
        proposalsCount: undefined,
        assetsCount: balances?.length,
      },
      isLoading: isBalancesLoading,
      refetchCounts: refetch,
    };
  }

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
  address: BechAddr,
  offset: number,
  limit: number
): AccountContracts => {
  const { data: contracts, isLoading } = useInstantiatedContractsByAddress(
    address,
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

export const useAccountContractsRest = (
  address: BechAddr
): AccountContracts => {
  const { data: contracts, isLoading } = useInstantiatedContractsByAddressRest(
    address,
    true
  );
  const { getContractLocalInfo } = useContractStore();
  const data = contracts?.map<ContractInfo>((contract) => {
    const localInfo = getContractLocalInfo(contract.contractAddress);

    return {
      ...contract,
      name: localInfo?.name,
      description: localInfo?.description,
      tags: localInfo?.tags,
      lists: localInfo?.lists,
      admin: undefined,
      latestUpdated: undefined,
      latestUpdater: undefined,
      remark: undefined,
    };
  });
  return {
    contracts: data,
    isLoading,
  };
};

export const useAccountAdminContracts = (
  address: BechAddr,
  offset: number,
  pageSize: number
): AccountContracts => {
  const { data: contractsAdmin, isLoading } = useAdminContractsByAddress(
    address,
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
  address: BechAddr,
  offset: number,
  limit: number
): AccountCodes => {
  const { data: codes, isLoading } = useCodesByAddress(address, limit, offset);

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
